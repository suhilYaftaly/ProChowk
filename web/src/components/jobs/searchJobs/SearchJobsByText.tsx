import { Stack } from "@mui/material";
import { useState, FormEvent, useEffect } from "react";
import { toast } from "react-toastify";

import ErrSnackbar from "@reusable/ErrSnackbar";
import { useSkills } from "@gqlOps/skill";
import { BudgetType, useJobsByLocation, useJobsByText } from "@gqlOps/job";
import { useUserStates } from "@redux/reduxStates";
import { JobsCards } from "../Jobs";
import SearchFilters, {
  ISearchFilterErrors,
  ISearchFilters,
  checkFilterOptionsError,
} from "./SearchFilters";
import SearchBar from "./SearchBar";
import { searchFilterConfigs as FCC } from "@config/configConst";

interface Props {}

export default function SearchJobsByText({}: Props) {
  const [searchText, setSearchText] = useState("");
  const [openErrBar, setOpenErrBar] = useState(false);
  const initialTypes: BudgetType[] = ["Hourly", "Project"];
  const [filters, setFilters] = useState<ISearchFilters>({
    radius: FCC.defaultRadius,
    address: undefined,
    latLng: undefined,
    budget: {
      types: initialTypes,
      maxHours: FCC.budget.defaultMaxHours,
      from: FCC.budget.from,
      to: FCC.budget.to,
    },
  });
  const [filterErrors, setFilterErrors] = useState<ISearchFilterErrors>({
    radius: "",
    address: "",
    budget: { types: "", maxHours: "", from: "", to: "" },
  });
  const {
    skillsAsync,
    data: allSkillsType,
    loading: allSkillsLoading,
    error: allSkillsError,
  } = useSkills();
  const allSkillsData = allSkillsType?.skills;
  const {
    jobsByTextAsync,
    data: jByTData,
    loading: jByTLoading,
  } = useJobsByText();
  const {
    jobsByLocationAsync,
    data: jByLData,
    loading: jByLLoading,
  } = useJobsByLocation();
  const jobData = jByTData?.jobsByText || jByLData?.jobsByLocation;
  const jobLoading = jByTLoading || jByLLoading;

  const { userLocation } = useUserStates();
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    const latLng = userLocation?.data;
    if (latLng) {
      jobsByLocationAsync({ variables: { latLng } });
      setFilters((prev) => ({ ...prev, latLng }));
    }
  }, [userLocation?.data]);

  const onSearch = (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setOpenDrawer(false);
    const errors = checkFilterOptionsError({
      filters: filters,
      setErrors: setFilterErrors,
    });

    if (errors.length > 0) {
      toast.error(FilterBannerErrorsJsx(errors));
      setOpenDrawer(true);
    }
    if (!searchText) toast.warning("Search text is empty.");

    if (filters.latLng && searchText) {
      const fBudget = filters.budget;
      jobsByTextAsync({
        variables: {
          inputText: searchText,
          latLng: filters.latLng,
          budget: {
            ...fBudget,
            maxHours: Number(fBudget.maxHours),
            from: Number(fBudget.from),
            to: Number(fBudget.to),
          },
          radius: Number(filters.radius),
        },
      });
    }
  };

  return (
    <>
      <Stack spacing={1}>
        <Stack component="form" autoComplete="off" onSubmit={onSearch}>
          <SearchBar
            acOnOpen={() => skillsAsync({})}
            acLoading={allSkillsLoading}
            acOptions={allSkillsData?.map((skill) => skill.label) || []}
            onFilterClick={() => setOpenDrawer(!openDrawer)}
            setSearchText={setSearchText}
          />
        </Stack>
        <div>
          <JobsCards
            jobs={jobData}
            loading={jobLoading}
            updateLoading={jobLoading}
          />
        </div>
        <ErrSnackbar
          open={openErrBar}
          handleClose={setOpenErrBar}
          errMsg={allSkillsError?.message}
        />
      </Stack>
      <SearchFilters
        open={openDrawer}
        setOpen={setOpenDrawer}
        initialTypes={initialTypes}
        filters={filters}
        setFilters={setFilters}
        filterErrors={filterErrors}
        setFilterErrors={setFilterErrors}
        onSearch={onSearch}
      />
    </>
  );
}

const FilterBannerErrorsJsx = (errors: string[]) => (
  <>
    {errors.map((err, i) =>
      errors.length != i + 1 ? (
        <div style={{ marginBottom: 5 }}>
          {err}
          <br />
        </div>
      ) : (
        <>{err}</>
      )
    )}
  </>
);
