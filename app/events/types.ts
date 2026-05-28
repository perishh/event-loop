export type EventActionResult =
  | { success: true; message: string }
  | {
      success: false;
      message?: string;
      fieldErrors?: Record<string, string[]>;
    };
