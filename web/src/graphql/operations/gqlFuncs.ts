import { store } from "@redux/store";
import { setGlobalError } from "@rSlices/settingsSlice";

const { dispatch } = store;

interface IAsyncOps {
  onStart?: () => void;
  operation: () => Promise<any>;
  onSuccess?: (data: any) => void;
  onError?: (error?: any) => void;
  showGlobalErr?: boolean;
}
export const asyncOps = async ({
  onStart,
  operation,
  onSuccess,
  onError,
  showGlobalErr = true,
}: IAsyncOps) => {
  try {
    onStart && onStart();
    const { data } = await operation();
    if (data) {
      onSuccess && onSuccess(data);
    } else throw new Error("Data not found");
  } catch (error: any) {
    console.log("Async operation error:", error.message);
    onError && onError(error.message);
    showGlobalErr && dispatch(setGlobalError(error.message));
  }
};
