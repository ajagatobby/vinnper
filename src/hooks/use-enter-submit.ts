import { KeyboardEvent } from "react";

export function useEnterSubmit(formRef: React.RefObject<HTMLFormElement>) {
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && event.metaKey) {
      event.preventDefault();

      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    }
  };

  return { handleKeyDown };
}
