# Plantric RBAC (Role-Based Access Control) System

## Overview
Plantric uses a scalable, dynamic RBAC (Role-Based Access Control) system to manage access across multiple organizations, projects, and users. It supports org-wide and project-specific roles, fine-grained permissions, and future flexibility for custom roles, template cloning, and lifecycle-based talent control.

This README outlines the schema, logic, UI expectations, and edge cases required for implementation.

---

## Core Concepts

### Hierarchy
```text
Organization
├── Global Admin (creates roles/templates)
│   └── Assigns Permissions to Roles (CRUD per feature group)
│       └── Invites PMs and BAs
│           └── PMs/BAs create Teams
│               └── Assign Stakeholders and Team Members
│                   └── Start Projects
│                       └── Assign Tasks (via WBS)
```

### Supported Role Scopes
- **Global Template Roles** (clonable, non-editable)
- **Org-Level Roles** (PM, BA, Developer, etc.)
- **Project-Specific Overrides**

### Role Flexibility
- BA can act as PM if permissions allow
- Org Admins can clone templates
- Reusability of teams/projects is restricted (for MVP simplicity)

---

## Database Schema

### `roles`
- `id`
- `org_id` (nullable for global templates)
- `name`
- `timestamps`

### `permissions`
- `id`
- `name` (e.g., `edit_project`)
- `group` (e.g., `Project`, `WBS`, `Sprint`)
- `label`
- `timestamps`

### `role_permissions`
- `id`
- `role_id`
- `permission_id`
- `allowed` (boolean for toggling)
- `timestamps`

### `user_roles`
- `id`
- `user_id`
- `org_id`
- `role_id`
- `project_id` (nullable)
- `timestamps`

---

## Permission Logic

### Sample Function (Custom Implementation)
```php
public function hasPermission($perm, $projectId = null)
{
    $roles = $this->roles()
        ->where(function ($q) use ($projectId) {
            $q->whereNull('project_id');
            if ($projectId) {
                $q->orWhere('project_id', $projectId);
            }
        })->get();

    foreach ($roles as $role) {
        if ($role->permissions->where('name', $perm)->where('allowed', true)->count()) {
            return true;
        }
    }

    return false;
}
```

### Laravel Gate Usage
```php
Gate::define('edit_requirement', fn ($user, $project) =>
    $user->hasPermission('edit_requirement', $project->id)
);
```

---

## UI Expectations

### Role Management Panel
- List of Roles (grouped by Org/Template)
- Clone & Edit for Org roles
- View effective permissions for each role

### Permission Assignment
- Accordion-style grouping by feature (Project, WBS, etc.)
- CRUD checkboxes within each group
- Toggle all permissions per group
- Auto-dependencies (e.g., checking "edit" also checks "view")

### Role Assignment Panel
- Assign user to Org/Project with dropdown
- Preview of inherited permissions
- Search & invite flow with status indicator (pending, active)

---

## Edge Cases & Scenarios

| Situation                                 | Handling Strategy                                        |
|------------------------------------------|----------------------------------------------------------|
| BA acts as PM                            | Override via custom role or duplicate permissions        |
| User leaves org                          | Remove roles, revoke access                             |
| Invite but not accepted                  | Track via invite token table, status: `pending`         |
| Org conflict for freelancer              | Show warning, allow override only with user approval     |
| New permissions added to role            | Notify admin, allow cascade or manual update            |
| Permissions revoked                      | Check fallback logic or deny on access check            |
| Multiple roles per user                  | Merge permissions, apply `allowed = true` precedence     |
| Org-specific role                        | Cannot be used globally, scoped by `org_id`             |
| Project-level override                   | `user_roles` record includes `project_id`               |

---

## Optional Enhancements

- **Preview as Role**: Simulate user view based on selected role
- **Audit Logs**: Track every permission assignment or revocation
- **Permission Templates**: Create groups of permissions for faster assignment
- **Granular Action Logging**: Track who triggered what via permission usage
- **Role Color Tags**: Help visualize user types in UI

---

## Next Steps
- Seed common permission groups (Project, Requirements, WBS, AI Tools, PDF Export, etc.)
- Build Role/Permission editor UI (Livewire or Blade or React?)
- Implement invitation and conflict-check flow for multi-org scenarios
- Connect policies & gates across the app

---

## Notes
Plantric’s RBAC is built for dynamic orgs and real-time project work. As the system evolves to include collaboration between organizations, the current architecture will support freelancers, advisors, and cross-company coordination using layered roles and scoped permissions.

---

Let’s build secure, flexible, and intelligent access control — so your PMs don’t accidentally delete the CEO’s dashboard again.
