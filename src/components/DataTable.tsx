"use client";

import { ChevronLeft, ChevronRight, Filter, Search, X } from "lucide-react";
import { ReactNode, useMemo, useState } from "react";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
  filterable?: boolean;
  filterOptions?: string[];
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  itemsPerPage?: number;
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  className?: string;
  tableClassName?: string;
  maxHeight?: string;
  showSearch?: boolean;
  orderBy?:
    | (keyof T)[]
    | {
        field: keyof T;
        direction?: "asc" | "desc";
      }[];
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  itemsPerPage = 10,
  searchPlaceholder = "Pesquisar...",
  searchFields = [],
  emptyMessage = "Nenhum item encontrado.",
  emptyIcon,
  className = "",
  tableClassName = "",
  maxHeight = "500px",
  showSearch = true,
  orderBy = [],
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>(
    {}
  );

  // Aplicar filtros primeiro
  const filteredData = useMemo(() => {
    let filtered = data;

    // Aplicar pesquisa global
    if (searchTerm && searchFields.length > 0) {
      filtered = filtered.filter((item) =>
        searchFields.some((field) => {
          const value = item[field];
          if (typeof value === "string") {
            return value.toLowerCase().includes(searchTerm.toLowerCase());
          }
          if (typeof value === "number") {
            return value.toString().includes(searchTerm);
          }
          return false;
        })
      );
    }

    // Aplicar filtros de coluna
    Object.entries(columnFilters).forEach(([columnKey, filterValue]) => {
      if (filterValue) {
        filtered = filtered.filter((item) => {
          const value = item[columnKey];
          if (typeof value === "string") {
            return value.toLowerCase().includes(filterValue.toLowerCase());
          }
          if (typeof value === "number") {
            return value.toString().includes(filterValue);
          }
          return false;
        });
      }
    });

    return filtered;
  }, [data, searchTerm, searchFields, columnFilters]);

  // Aplicar ordenação aos dados filtrados
  const sortedAndFilteredData = useMemo(() => {
    let sorted = [...filteredData];

    // Aplicar ordenação hierárquica correta
    sorted.sort((a, b) => {
      // Iterar por cada critério de ordenação
      for (const orderConfig of orderBy) {
        const field =
          typeof orderConfig === "string"
            ? orderConfig
            : typeof orderConfig === "object" && "field" in orderConfig
              ? orderConfig.field
              : orderConfig;
        let direction =
          typeof orderConfig === "string"
            ? "asc"
            : typeof orderConfig === "object" && "direction" in orderConfig
              ? orderConfig.direction
              : "asc";

        // Para o campo status, assumir sempre ordem ascendente se não especificado
        if (
          field === "status" &&
          typeof orderConfig === "object" &&
          !orderConfig.direction
        ) {
          direction = "asc";
        }

        const valueA = a[field] as string | number | Date | null | undefined;
        const valueB = b[field] as string | number | Date | null | undefined;

        // Tratar valores null/undefined
        if (valueA == null && valueB == null) continue;
        if (valueA == null) return direction === "asc" ? 1 : -1;
        if (valueB == null) return direction === "asc" ? -1 : 1;

        let comparison = 0;

        // Ordenação especial para o campo status
        if (field === "status") {
          const statusOrder = {
            pending: 1,
            approved: 2,
            rejected: 3,
          };

          const orderA = statusOrder[valueA as keyof typeof statusOrder] || 999;
          const orderB = statusOrder[valueB as keyof typeof statusOrder] || 999;

          comparison = orderA - orderB;
        }
        // Tratar datas especificamente
        else if (valueA instanceof Date && valueB instanceof Date) {
          comparison = valueA.getTime() - valueB.getTime();
        }
        // Ordenação normal para strings e números
        else {
          if (valueA < valueB) comparison = -1;
          else if (valueA > valueB) comparison = 1;
          else comparison = 0;
        }

        // Se há diferença, aplicar direção e retornar
        if (comparison !== 0) {
          return direction === "asc" ? comparison : -comparison;
        }
        
        // Se são iguais, continuar para o próximo critério
      }
      
      // Se todos os critérios são iguais
      return 0;
    });

    return sorted;
  }, [filteredData, orderBy]);

  // Calcular paginação com dados ordenados
  const totalPages = Math.ceil(sortedAndFilteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedAndFilteredData.slice(startIndex, endIndex);

  // Reset página quando dados mudam
  useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const handleColumnFilter = (columnKey: string, value: string) => {
    setColumnFilters((prev) => ({
      ...prev,
      [columnKey]: value,
    }));
    setCurrentPage(1); // Reset para primeira página
  };

  const clearColumnFilter = (columnKey: string) => {
    setColumnFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[columnKey];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setColumnFilters({});
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || Object.keys(columnFilters).length > 0;

  return (
    <div className={`festival-card flex flex-col ${className}`}>
      <div className="p-6 pb-4 flex-shrink-0 border-b border-verde-suave/10">
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center space-x-4 justify-between w-full">
            <div className="text-sm text-cinza-chumbo/70">
              Mostrando {startIndex + 1}-
              {Math.min(endIndex, sortedAndFilteredData.length)} de{" "}
              {sortedAndFilteredData.length} itens
            </div>
            <div className="flex items-center space-x-4">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-verde-suave hover:text-verde-suave/80 font-medium transition-colors"
                >
                  Limpar filtros
                </button>
              )}
              {showSearch && (
                <div className="mb-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-cinza-chumbo/50" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="block w-full pl-10 pr-10 py-3 border border-verde-suave/20 rounded-lg focus:ring-2 focus:ring-verde-suave focus:border-verde-suave placeholder-cinza-chumbo/50 transition-colors"
                      placeholder={searchPlaceholder}
                    />
                    {searchTerm && (
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setCurrentPage(1);
                        }}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-cinza-chumbo/50 hover:text-cinza-chumbo transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          {totalPages > 1 && (
            <div className="text-sm text-cinza-chumbo/70">
              Página {currentPage} de {totalPages}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6" style={{ maxHeight }}>
        <table className={`w-full ${tableClassName}`}>
          <thead className="sticky top-0 bg-white z-10">
            <tr className="border-b border-verde-suave/10">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`text-left py-4 px-2 font-semibold text-cinza-chumbo bg-white ${column.headerClassName || ""}`}
                >
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <span>{column.header}</span>
                      {column.filterable && (
                        <Filter className="h-4 w-4 text-cinza-chumbo/50" />
                      )}
                    </div>

                    {column.filterable && (
                      <div className="relative">
                        <input
                          type="text"
                          value={columnFilters[column.key as string] || ""}
                          onChange={(e) =>
                            handleColumnFilter(
                              column.key as string,
                              e.target.value
                            )
                          }
                          className="w-full px-2 py-1 text-xs border border-verde-suave/20 rounded focus:ring-1 focus:ring-verde-suave focus:border-verde-suave placeholder-cinza-chumbo/40"
                          placeholder="Filtrar..."
                        />
                        {columnFilters[column.key as string] && (
                          <button
                            onClick={() =>
                              clearColumnFilter(column.key as string)
                            }
                            className="absolute inset-y-0 right-0 pr-1 flex items-center text-cinza-chumbo/50 hover:text-cinza-chumbo"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr
                key={index}
                className="border-b border-verde-suave/5 hover:bg-verde-suave/5 transition-colors"
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`py-4 px-2 ${column.className || ""}`}
                  >
                    {column.render
                      ? column.render(item, startIndex + index)
                      : String(item[column.key] || "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Estado Vazio */}
        {sortedAndFilteredData.length === 0 && (
          <div className="text-center py-12">
            {emptyIcon && (
              <div className="flex justify-center mb-4">{emptyIcon}</div>
            )}
            <p className="text-cinza-chumbo/70 mb-2">{emptyMessage}</p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-verde-suave hover:text-verde-suave/80 font-medium transition-colors"
              >
                Limpar filtros para ver todos os itens
              </button>
            )}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="p-6 pt-4 flex-shrink-0 border-t border-verde-suave/10">
          <div className="flex items-center justify-between">
            {/* Informações da Paginação */}
            <div className="text-sm text-cinza-chumbo/70">
              {filteredData.length}{" "}
              {filteredData.length === 1 ? "item" : "itens"} no total
            </div>

            {/* Controles de Paginação */}
            <div className="flex items-center space-x-2">
              {/* Botão Anterior */}
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-verde-suave/20 text-cinza-chumbo hover:bg-verde-suave/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Números das Páginas */}
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    page === currentPage
                      ? "bg-verde-suave text-white"
                      : "text-cinza-chumbo hover:bg-verde-suave/10 border border-verde-suave/20"
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Botão Próximo */}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-verde-suave/20 text-cinza-chumbo hover:bg-verde-suave/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Hook para facilitar o uso
export function useDataTable<T>(data: T[], itemsPerPage = 10) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  return {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
  };
}
