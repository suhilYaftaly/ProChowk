import {
  useState,
  Dispatch,
  SetStateAction,
  FormEvent,
  useEffect,
} from "react";
import { Box, Typography, styled } from "@mui/material";
import RoofingIcon from "@mui/icons-material/Roofing";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";

import AddAdService from "./AddAdService";
import { IUserInfo } from "@user/userProfile/UserInfo";
import { SkillInput } from "@gqlOps/contractor";
import { IAd, IAdSkill } from "../Ads";

interface Props extends IUserInfo {
  setAds: Dispatch<SetStateAction<IAd[] | undefined>>;
  closeEdit: () => void;
}

export default function AddAd({ setAds, closeEdit, contrData }: Props) {
  const [showTypeSele, setShowTypeSele] = useState(true);
  const [ad, setAd] = useState<IAd>({
    id: String(Math.random()),
    type: "Service",
    title: "",
    desc: "",
    skills: addSkills(contrData?.skills),
  });

  useEffect(() => {
    setAd({
      id: String(Math.random()),
      type: "Service",
      title: "",
      desc: "",
      skills: addSkills(contrData?.skills),
    });
  }, [contrData?.skills]);

  const handleSave = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setAds((pv) => (pv ? [...pv, ad] : [ad]));
    closeEdit();
  };

  const onTypeSele = (type: IAd["type"]) => {
    setAd((pv) => ({ ...pv, type }));
    setShowTypeSele(false);
  };

  return (
    <>
      {showTypeSele ? (
        <Box>
          <Typography sx={{ textAlign: "center", m: 2 }} variant="h5">
            Select AD Type
          </Typography>
          <Box
            sx={{
              alignContent: "center",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              gap: 5,
              padding: 2,
            }}
          >
            <SelectBox onClick={() => onTypeSele("Service")}>
              <Box>
                <Box
                  sx={{
                    border: "2px solid",
                    p: 1,
                    borderRadius: 10,
                    mb: 1,
                  }}
                >
                  <RoofingIcon sx={{ width: 100, height: 100 }} />
                </Box>
                <Typography textAlign={"center"}>Service</Typography>
              </Box>
            </SelectBox>
            <SelectBox onClick={() => onTypeSele("Job")}>
              <Box>
                <Box
                  sx={{
                    border: "2px solid",
                    p: 1,
                    borderRadius: 10,
                    mb: 1,
                  }}
                >
                  <PersonSearchIcon sx={{ width: 100, height: 100 }} />
                </Box>
                <Typography textAlign={"center"}>Job (Hiring)</Typography>
              </Box>
            </SelectBox>
          </Box>
        </Box>
      ) : ad.type === "Service" ? (
        <AddAdService handleSave={handleSave} ad={ad} setAd={setAd} />
      ) : (
        <Typography sx={{ m: 5, textAlign: "center" }}>
          Coming Soon!!
        </Typography>
      )}
    </>
  );
}

const addSkills = (skills: SkillInput[] | undefined): IAdSkill[] => {
  if (!skills) return [];
  return skills?.map((skill) => ({ ...skill, selected: false }));
};

const SelectBox = styled(Box)((theme) => ({
  "&:hover": {
    color: theme.theme.palette.primary.main,
  },
}));
