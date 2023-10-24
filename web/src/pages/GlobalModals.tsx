import PostAJob from "@jobs/edits/PostAJob";
import { useAppDispatch } from "@utils/hooks/hooks";
import { useGlobalModalsStates } from "@redux/reduxStates";
import { setOpenJobPost } from "@rSlices/globalModalsSlice";

export default function GlobalModals() {
  const dispatch = useAppDispatch();
  const { openJobPost } = useGlobalModalsStates();

  return (
    <>
      <PostAJob
        open={openJobPost}
        setOpen={(toggle) => dispatch(setOpenJobPost(toggle))}
      />
    </>
  );
}
