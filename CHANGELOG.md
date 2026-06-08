# Changelog

All notable changes to this project will be documented in this file.

## [1.0.4]

### Fixed
- Resolved a TypeScript mismatch error when consumers use different versions of Payload. The plugin now uses a more flexible type for `Access` configurations (`permissionsAccess`, `rolesAccess`, and `checkPermission` utility) to ensure seamless compatibility with `payload@3.85.x` and beyond.
- Bumped Payload peer dependencies to `^3.85.0`.

## [1.0.3]

### Added
- Added `permissionsAccess` and `rolesAccess` to `PluginOptions` to allow customizing the Payload `access` control functions for the generated `Roles` and `Permissions` collections.
- Set default access control for `create`, `read`, `update`, and `delete` to return `true` for both `Roles` and `Permissions` collections when no custom access control is provided.
