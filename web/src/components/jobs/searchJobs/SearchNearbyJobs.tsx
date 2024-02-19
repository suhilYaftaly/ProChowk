import { Pagination, Stack, useTheme } from "@mui/material";
import { useState, FormEvent, useEffect } from "react";
import { toast } from "react-toastify";

import { useSkills } from "@gqlOps/skill";
import { useJobsByLocation, useJobsByText } from "@gqlOps/job";
import { useUserStates } from "@redux/reduxStates";
import NearbyJobsFilters, {
  ISearchFilterErrors,
  ISearchFilters,
  checkFilterOptionsError,
} from "./NearbyJobsFilters";
import SearchBar from "@reusable/appComps/SearchBar";
import { searchNearbyJobsFilterConfigs as FCC } from "@config/configConst";
import NoSearchResultsWidget from "@reusable/widgets/NoSearchResultsWidget";
import Text from "@reusable/Text";
import ToastErrorsList from "@reusable/ToastErrorsList";
import JobsCards from "./JobsCards";

export default function SearchNearbyJobs() {
  const theme = useTheme();
  const primaryC = theme.palette.primary.main;
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<ISearchFilters>(FCC.defaults);
  const [filterErrors, setFilterErrors] = useState<ISearchFilterErrors>({
    radius: "",
    address: "",
    budget: { from: "", to: "" },
  });
  const {
    skillsAsync,
    data: allSkillsType,
    loading: allSkillsLoading,
  } = useSkills();
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
  const jobsData = jByTData?.jobsByText || jByLData?.jobsByLocation;
  const jobsList = jobsData?.jobs;
  const jobsTotalCount = jobsData?.totalCount;
  const jobsLoading = jByTLoading || jByLLoading;
  const { userLocation } = useUserStates();
  const latLng = userLocation?.data;
  const [openDrawer, setOpenDrawer] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const totalPages = jobsTotalCount ? Math.ceil(jobsTotalCount / pageSize) : 0;

  useEffect(() => {
    if (latLng && !jByLData) {
      searchByLocation();
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

  const searchByLocation = (currentPage = page) => {
    if (latLng) {
      jobsByLocationAsync({
        variables: {
          latLng,
          page: currentPage,
          pageSize,
          radius: Number(filters.radius),
        },
      });
    }
  };

  const searchByText = (e?: FormEvent<HTMLFormElement>, currentPage = page) => {
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
      toast.error(ToastErrorsList({ errors }));
      setOpenDrawer(true);
      return;
    }
    if (!searchText) {
      toast.warning("Search text is empty.");
      return;
    }

    if (filters.latLng && searchText) {
      const fBudget = filters.budget;
      jobsByTextAsync({
        variables: {
          inputText: searchText,
          latLng: filters.latLng,
          budget: {
            ...fBudget,
            from: Number(fBudget.from),
            to: Number(fBudget.to),
          },
          radius: Number(filters.radius),
          startDate: filters.startDate,
          page: currentPage,
          pageSize,
        },
      });
    }
  };

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
    //if results are from text search then call search by text
    if (jByTData) searchByText(_, value);
    else searchByLocation(value);
  };

  const searchInputChange = (value: string) => {
    setSearchText(value);
    skillsAsync({ variables: { search: value } });
  };

  return (
    <>
      <Stack
        component="form"
        autoComplete="off"
        onSubmit={searchByText}
        sx={{ mb: 2 }}
      >
        <SearchBar
          acLoading={allSkillsLoading}
          acOptions={allSkillsType?.skills?.map((skill) => skill.label) || []}
          onFilterClick={() => setOpenDrawer(!openDrawer)}
          setSearchText={searchInputChange}
          label="Search nearby jobs"
          placeholder="Search by job title, description or skill"
        />
      </Stack>
      {jobsList?.length === 0 ? (
        <NoSearchResultsWidget title="No jobs found!" />
      ) : (
        <>
          {jobsList && jobsTotalCount && jobsTotalCount > 0 && (
            <Text type="subtitle" sx={{ mb: 2, mt: 3 }}>
              Jobs Found{" "}
              <span
                style={{ color: primaryC }}
              >{`(${jobsList?.length}/${jobsTotalCount})`}</span>
            </Text>
          )}
          <JobsCards jobs={jobsList} loading={jobsLoading} />
          {jobsTotalCount && jobsTotalCount > pageSize && (
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              sx={{ display: "flex", justifyContent: "center", mt: 2 }}
            />
          )}
        </>
      )}
      <NearbyJobsFilters
        open={openDrawer}
        setOpen={setOpenDrawer}
        filters={filters}
        setFilters={setFilters}
        filterErrors={filterErrors}
        setFilterErrors={setFilterErrors}
        onSearch={searchByText}
      />
    </>
  );
}
