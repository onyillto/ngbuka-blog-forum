// This file is used to declare modules for file types that TypeScript doesn't understand by default.

// By declaring '*.css', we tell TypeScript that importing a CSS file is a valid operation.
// This is primarily for side-effect imports, like loading global stylesheets.
declare module "*.css";
