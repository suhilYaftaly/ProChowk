import { Dispatch, SetStateAction, FormEvent } from "react";
import AdForm, { IAd } from "./AdForm";

interface Props {
  ad: IAd;
  setAd: (ad: IAd) => void;
  setAds: Dispatch<SetStateAction<IAd[] | undefined>>;
  closeEdit: () => void;
}

export default function EditAd({ ad, setAd, setAds, closeEdit }: Props) {
  const handleEdit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setAds((pv) => (pv ? pv.map((j) => (j.id === ad.id ? ad : j)) : [ad]));
    closeEdit();
  };

  return <AdForm handleSave={handleEdit} ad={ad} setAd={setAd} />;
}
