import { createAccessControl } from "better-auth/plugins/access";
const statement = { view: ["manage", "event"] } as const;
export const ac = createAccessControl(statement);
export const admin = ac.newRole({
  view: ["manage", "event"],
});
export const operator = ac.newRole({ view: ["event"] });
