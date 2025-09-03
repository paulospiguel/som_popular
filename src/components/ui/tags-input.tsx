import { X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

function useDidUpdateEffect(fn: any, inputs: any) {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) fn();
    else didMountRef.current = true;
  }, inputs);
}

interface TagProps {
  text: string;
  remove: any;
  disabled?: boolean;
  className?: string;
  icon?: React.ElementType | null;
}

export interface TagsInputProps {
  name?: string;
  placeHolder?: string;
  value?: string[] | null;
  onChange?: (tags: string[]) => void;
  onBlur?: any;
  separators?: string[];
  disableBackspaceRemove?: boolean;
  onExisting?: (tag: string) => void;
  onRemoved?: (tag: string) => void;
  disabled?: boolean;
  isEditOnRemove?: boolean;
  beforeAddValidate?: (tag: string, existingTags: string[]) => boolean;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  classNames?: {
    input?: string;
    tag?: string;
  };
  maxTagsCount?: number;
  icon?: React.ElementType | null;
}

const defaultSeparators = ["Enter", "Tab"];

function Tag({ text, remove, disabled, className, icon }: TagProps) {
  const handleOnRemove = (e: any) => {
    e.stopPropagation();
    remove(text);
  };

  const Icon = icon || null;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 text-sm font-medium shadow-sm transition-all duration-200 hover:from-amber-600 hover:to-orange-600 hover:shadow-md",
        "border border-amber-400/30",
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4 mr-2 text-amber-100" />}
      <span className="mr-1">{text}</span>
      {!disabled && (
        <button
          type="button"
          onClick={handleOnRemove}
          aria-label={`remover ${text}`}
          className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-600/40 text-amber-100 transition-all duration-200 hover:bg-amber-600/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}

const TagsInput = ({
  name,
  placeHolder,
  value,
  onChange,
  onBlur,
  separators,
  disableBackspaceRemove,
  onExisting,
  onRemoved,
  disabled,
  isEditOnRemove,
  beforeAddValidate,
  onKeyUp,
  classNames,
  maxTagsCount,
  icon,
}: TagsInputProps) => {
  const [tags, setTags] = useState<any>(value || []);
  const [inputValue, setInputValue] = useState("");

  useDidUpdateEffect(() => {
    onChange && onChange(tags);
  }, [tags]);

  useDidUpdateEffect(() => {
    if (JSON.stringify(value) !== JSON.stringify(tags)) {
      setTags(value || []);
    }
  }, [value]);

  const placeholderText =
    maxTagsCount !== undefined && tags.length >= maxTagsCount
      ? `Máximo de ${maxTagsCount} prêmios atingido`
      : placeHolder;

  const handleOnKeyDown = (e: any) => {
    e.stopPropagation();

    if (
      !e.target.value &&
      !disableBackspaceRemove &&
      tags.length &&
      e.key === "Backspace"
    ) {
      e.target.value = isEditOnRemove ? `${tags.at(-1)} ` : "";
      setTags([...tags.slice(0, -1)]);
      return;
    }

    if (maxTagsCount !== undefined && tags.length >= maxTagsCount) {
      e.preventDefault();
      return;
    }

    const text = e.target.value.trim();

    if (text && (separators || defaultSeparators).includes(e.key)) {
      e.preventDefault();
      if (beforeAddValidate && !beforeAddValidate(text, tags)) return;

      if (tags.includes(text)) {
        onExisting && onExisting(text);
        return;
      }

      setTags([...tags, text]);
      setInputValue("");
      e.target.value = "";
    }
  };

  const onTagRemove = (text: string) => {
    const newTags = tags.filter((tag: string) => tag !== text);
    setTags(newTags);
    onRemoved && onRemoved(text);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const text = e.target.value.trim();
    if (text && !tags.includes(text)) {
      if (maxTagsCount === undefined || tags.length < maxTagsCount) {
        if (!beforeAddValidate || beforeAddValidate(text, tags)) {
          setTags([...tags, text]);
          setInputValue("");
        }
      }
    }
    onBlur && onBlur(e);
  };

  return (
    <div
      aria-labelledby={name}
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 transition-all duration-200",
        "focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-100 focus-within:ring-offset-0",
        "hover:border-gray-300",
        disabled && "opacity-50 cursor-not-allowed bg-gray-50"
      )}
    >
      {tags.map((tag: any) => (
        <Tag
          key={tag}
          className={classNames?.tag || ""}
          text={tag}
          remove={onTagRemove}
          disabled={disabled || false}
          icon={icon || null}
        />
      ))}

      <input
        className={cn(
          "h-8 flex-grow bg-transparent text-sm text-gray-900 placeholder:text-gray-400",
          "focus:outline-none focus:ring-0",
          "disabled:cursor-not-allowed disabled:opacity-50",
          classNames?.input
        )}
        type="text"
        name={name}
        value={inputValue}
        placeholder={placeholderText}
        onKeyDown={handleOnKeyDown}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        disabled={disabled}
        onKeyUp={onKeyUp}
      />
    </div>
  );
};

export { TagsInput };
