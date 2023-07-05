import { Dispatch, SetStateAction, FormEvent } from "react";
import AddAdService from "./AddAdService";
import { IAd } from "../Ads";

interface Props {
  ad: IAd;
  setAd: Dispatch<SetStateAction<IAd>>;
  setAds: Dispatch<SetStateAction<IAd[] | undefined>>;
  closeEdit: () => void;
}

export default function EditAd({ ad, setAd, setAds, closeEdit }: Props) {
  const handleEdit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setAds((pv) => (pv ? pv.map((j) => (j.id === ad.id ? ad : j)) : [ad]));
    closeEdit();
  };

  return <AddAdService handleSave={handleEdit} ad={ad} setAd={setAd} />;
}
