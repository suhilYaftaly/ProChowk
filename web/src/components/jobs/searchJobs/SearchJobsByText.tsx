import { Card, Stack } from "@mui/material";
import { useState, FormEvent, useEffect } from "react";
import { toast } from "react-toastify";

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
import NoSearchResultsWidget from "@reusable/widgets/NoSearchResultsWidget";

export default function SearchJobsByText() {
  const [searchText, setSearchText] = useState("");
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

  //hide keyboard on drawer close
  useEffect(() => {
    if (!openDrawer) {
      // Blur the currently focused element
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  }, [openDrawer]);

  const onSearch = (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    // Blur the currently focused element
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

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
      <Card sx={{ p: 2 }}>
        <Stack
          component="form"
          autoComplete="off"
          onSubmit={onSearch}
          sx={{ mb: 2 }}
        >
          <SearchBar
            acOnOpen={() => skillsAsync({})}
            acLoading={allSkillsLoading}
            acOptions={allSkillsData?.map((skill) => skill.label) || []}
            onFilterClick={() => setOpenDrawer(!openDrawer)}
            setSearchText={setSearchText}
          />
        </Stack>
        {jobData?.length === 0 ? (
          <NoSearchResultsWidget title="No jobs found!" />
        ) : (
          <JobsCards
            jobs={jobData}
            loading={jobLoading}
            updateLoading={jobLoading}
          />
        )}
      </Card>
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
        <div key={i} style={{ marginBottom: 5 }}>
          {err}
          <br />
        </div>
      ) : (
        <div key={i}>{err}</div>
      )
    )}
  </>
);
