/* import { toast } from "react-toastify";

import { paths } from "@routes/Routes";
import { navigate } from "@routes/navigationService"; */

import Toast from 'react-native-toast-message';

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
    const { data, error } = await operation();
    if (data) onSuccess && onSuccess(data);
    else throw new Error(error.message);
  } catch (error: any) {
    console.log('Async operation error:', error.message);
    onError && onError(error.message);
    if (showGlobalErr) {
      Toast.show({
        type: 'error',
        text1: `${error.message}`,
      });
      /*  if (error.message === 'Unverified email. Please verify your email.') {
        navigate(paths.verifyEmail);
      } */
    }
  }
};
