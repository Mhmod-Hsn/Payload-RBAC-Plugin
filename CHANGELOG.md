# Changelog

All notable changes to this project will be documented in this file.
## [1.1.0]

### Added
- **Major Update: Attribute-Based Access Control (ABAC)**. The plugin now natively supports dynamic Row-Level Security!
- Added `conditions` array field to the `Permissions` collection to allow administrators to define dynamic row-level access queries via the UI (e.g. `sender equals {{user.id}}`).
- Introduced the `getPermissionQuery` utility, which evaluates a user's permissions and maps UI conditions into a standard Payload `Where` object. Supports dynamic variables: `{{user.id}}`, `{{user.role}}`, and `{{user.roles}}`.
- Updated `checkPermission` Higher-Order Function to automatically enforce these dynamic UI queries at the collection access level, requiring zero code changes for consumers.

## [1.0.4]

### Fixed
- Resolved a TypeScript mismatch error when consumers use different versions of Payload. The plugin now uses a more flexible type for `Access` configurations (`permissionsAccess`, `rolesAccess`, and `checkPermission` utility) to ensure seamless compatibility with `payload@3.85.x` and beyond.
- Bumped Payload peer dependencies to `^3.85.0`.

## [1.0.3]

### Added
- Added `permissionsAccess` and `rolesAccess` to `PluginOptions` to allow customizing the Payload `access` control functions for the generated `Roles` and `Permissions` collections.
- Set default access control for `create`, `read`, `update`, and `delete` to return `true` for both `Roles` and `Permissions` collections when no custom access control is provided.
