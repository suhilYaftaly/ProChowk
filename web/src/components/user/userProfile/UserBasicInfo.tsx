import {
  ButtonBase,
  Avatar,
  Typography,
  Stack,
  IconButton,
  Skeleton,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { useMutation } from "@apollo/client";

import { setUserProfile } from "@rSlices/userSlice";
import { useAppDispatch } from "@/utils/hooks/hooks";
import { processImageFile, convertUnixToDate } from "@/utils/utilFuncs";
import { IUserInfo } from "./UserInfo";
import UserBasicInfoEdit from "./edits/UserBasicInfoEdit";
import userOps, {
  AddressInput,
  IUpdateUserData,
  IUpdateUserInput,
} from "@gqlOps/user";
import CustomModal from "@reusable/CustomModal";
import ErrSnackbar from "@components/ErrSnackbar";

export default function UserBasicInfo({
  user,
  isMyProfile,
  loading,
}: IUserInfo) {
  const dispatch = useAppDispatch();
  const [image, setImage] = useState(user?.image);
  const [openEdit, setOpenEdit] = useState(false);
  const [updateUser, { loading: updateLoading, error: imageError }] =
    useMutation<IUpdateUserData, IUpdateUserInput>(
      userOps.Mutations.updateUser
    );
  const [openImgErrBar, setOpenImgErrBar] = useState(false);

  useEffect(() => {
    setImage(user?.image);
  }, [user]);

  const updateImage = async (formImage: any) => {
    if (user) {
      try {
        const { data } = await updateUser({
          variables: { id: user.id, image: formImage },
        });
        if (data?.updateUser) {
          setImage(formImage);
          dispatch(setUserProfile(data?.updateUser));
        } else throw new Error();
      } catch (error: any) {
        setOpenImgErrBar(true);
        console.log("image update failed:", error.message);
      }
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      processImageFile(
        file,
        (imageUrl) => {
          const formImage = {
            picture: imageUrl,
            name: file.name,
            size: file.size,
            type: file.type,
          };
          updateImage(formImage);
        },
        400
      );
    }
  };

  const handleCall = () => {
    window.location.href = `tel:${user?.phoneNum}`;
  };

  return (
    <>
      <Stack>
        <Stack spacing={2} direction={"row"} sx={{ alignItems: "center" }}>
          {updateLoading || loading ? (
            <Skeleton variant="circular" width={120} height={120} />
          ) : isMyProfile ? (
            <ButtonBase component="label" htmlFor="avatar-upload">
              <Avatar
                alt={user?.name}
                src={image?.picture}
                sx={{ width: 120, height: 120 }}
              />
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </ButtonBase>
          ) : (
            <Avatar
              alt={user?.name}
              src={image?.picture}
              sx={{ width: 120, height: 120 }}
            />
          )}
          {loading ? (
            <Stack>
              <Skeleton variant="text" width={150} />
              <Skeleton variant="text" width={150} />
            </Stack>
          ) : (
            <Stack>
              <Typography variant="h5">{user?.name}</Typography>
              <Typography color="text.secondary">
                Joined {convertUnixToDate(user?.createdAt)?.monthDayYear}
              </Typography>
            </Stack>
          )}
        </Stack>
        {!loading && (
          <>
            <Stack
              direction={"row"}
              sx={{
                my: 2,
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Stack>
                {loading ? (
                  <Skeleton variant="text" width={150} />
                ) : (
                  <>
                    <Typography onClick={handleCall}>
                      {user?.phoneNum}
                    </Typography>
                    {user?.address && (
                      <Typography variant="body2" color={"text.secondary"}>
                        {getBasicAdd(user.address)}
                      </Typography>
                    )}
                  </>
                )}
              </Stack>
              {isMyProfile && (
                <IconButton onClick={() => setOpenEdit(true)}>
                  <EditIcon />
                </IconButton>
              )}
            </Stack>
            <Typography variant="body2">{user?.bio}</Typography>
          </>
        )}
      </Stack>
      <CustomModal
        title="Edit Info"
        open={openEdit}
        setOpen={() => setOpenEdit(false)}
      >
        <UserBasicInfoEdit user={user} closeEdit={() => setOpenEdit(false)} />
      </CustomModal>
      <ErrSnackbar
        open={openImgErrBar}
        handleClose={setOpenImgErrBar}
        errMsg={imageError?.message}
      />
    </>
  );
}

const getBasicAdd = (address: AddressInput) => {
  let add = "";
  if (address?.city) add += address?.city + ", ";
  if (address?.province) add += address?.province + ", ";
  if (address?.country) add += address?.country;
  return add;
};
