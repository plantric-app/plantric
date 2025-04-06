# Frontend Documentation

## Overview
This documentation outlines the structure, components, and configuration for the frontend sidebar navigation implemented using React.js in the provided project. The frontend codebase includes distinct folders for managing project creation and viewing functionalities.

---

## Folder Structure

### src/app/(control-panel)

The main frontend components related to project creation and viewing are organized as follows:

```plaintext
src/
 └── app/
     └── (control-panel)/
         ├── CreateProject/
         │   ├── createProject.tsx
         │   └── createProjectRoute.tsx
         └── ViewProject/
             ├── constants/
             ├── ProjectStatus.tsx
             ├── ProjectTable.tsx
             ├── ProjectTableHead.tsx
             ├── ViewProject.tsx
             └── ViewProjectRoute.tsx
```

### Important Files:
- **CreateProject:** Contains components for creating a new project.
  - `createProject.tsx`: Main UI component for project creation form.
  - `createProjectRoute.tsx`: Defines the route for project creation.

- **ViewProject:** Components to view existing projects.
  - `ViewProject.tsx`: Displays existing projects.
  - `ViewProjectRoute.tsx`: Defines the route for viewing projects.
  - `ProjectTable.tsx`, `ProjectTableHead.tsx`: Components to handle tabular display of project data.
  - `ProjectStatus.tsx`: Handles display logic related to project statuses.

---

## Sidebar Navigation

The sidebar navigation utilizes the configuration from `navigationConfig.ts` located in:

```plaintext
src/configs/navigationConfig.ts
```

This configuration file defines navigation items with their respective properties:

- **id:** Unique identifier for navigation items.
- **icon:** Icon displayed next to the navigation title.
- **url:** Route to navigate when the item is clicked.
- **title:** Display name of the navigation item.
- **type:** Type of navigation (e.g., group, item, collapse).

Example configuration snippet:

```typescript
{
    id: 'project',
    title: 'Project',
    type: 'collapse',
    icon: 'heroicons-outline:view-list',
    children: [
        {
            id: 'create-project',
            title: 'Create',
            type: 'item',
            icon: 'heroicons-outline:plus-circle',
            url: '/create-project',
        },
        {
            id: 'view-project',
            title: 'View',
            type: 'item',
            icon: 'heroicons-outline:eye',
            url: '/view-project',
        },
    ],
},
```

---

## User Interface

The UI includes the following sidebar items:
- **Dashboard:** Main landing page.
- **Project:** Collapsible menu containing:
  - **Create:** Opens the form for creating new projects.
  - **View:** Shows the list of existing projects.

---

## Technologies

- **Frontend Framework:** React.js
- **Styling and UI Components:** Fuse React, MUI

---

This structured approach ensures maintainability, scalability, and clear navigation in your React.js application.