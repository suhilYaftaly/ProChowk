import { Pagination, Stack, useTheme } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

import SearchBar from "@reusable/appComps/SearchBar";
import { useSkills } from "@gqlOps/skill";
import {
  useContractorsByLocation,
  useContractorsByText,
} from "@gqlOps/contractor";
import { useUserStates } from "@/redux/reduxStates";
import ToastErrorsList from "@reusable/ToastErrorsList";
import { nearbyContsFilterConfigs as CC } from "@/config/configConst";
import NearbyContsFilters, {
  INearbyContFilterErrors,
  checkNearbyContsFilters,
} from "./NearbyContsFilters";
import NoSearchResultsWidget from "@reusable/widgets/NoSearchResultsWidget";
import Text from "@reusable/Text";
import ContractorsCards from "./ContractorsCards";

export default function SearchNearbyContractors() {
  const theme = useTheme();
  const primaryC = theme.palette.primary.main;
  const { userLocation } = useUserStates();
  const latLng = userLocation?.data;
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(CC.defaults);
  const pageSize = 20;
  const [filterErrors, setFilterErrors] = useState<INearbyContFilterErrors>({
    radius: "",
    address: "",
  });

  const {
    skillsAsync,
    data: allSkillsType,
    loading: allSkillsLoading,
  } = useSkills();
  const {
    contractorsByLocationAsync,
    data: cByLData,
    loading: cByLLoading,
  } = useContractorsByLocation();
  const {
    contractorsByTextAsync,
    data: cByTData,
    loading: cByTLoading,
  } = useContractorsByText();

  const contsData =
    cByTData?.contractorsByText || cByLData?.contractorsByLocation;
  const contsList = contsData?.users;
  const contsLoading = cByLLoading || cByTLoading;
  const contsTotalCount = contsData?.totalCount;
  const totalPages = contsTotalCount
    ? Math.ceil(contsTotalCount / pageSize)
    : 0;

  useEffect(() => {
    if (latLng && !cByLData) {
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
      contractorsByLocationAsync({
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
    const errors = checkNearbyContsFilters({
      filters,
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
      contractorsByTextAsync({
        variables: {
          input: searchText,
          latLng: filters.latLng,
          radius: Number(filters.radius),
          page: currentPage,
          pageSize,
        },
      });
    }
  };

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
    //if results are from text search then call search by text
    if (cByTData) searchByText(_, value);
    else searchByLocation(value);
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
          acOnOpen={() => skillsAsync({})}
          acLoading={allSkillsLoading}
          acOptions={allSkillsType?.skills?.map((skill) => skill.label) || []}
          onFilterClick={() => setOpenDrawer(!openDrawer)}
          setSearchText={setSearchText}
          label="Search nearby contractors"
          placeholder="Search by user name, about or skill"
        />
      </Stack>
      {contsList?.length === 0 ? (
        <NoSearchResultsWidget title="No contractors found!" />
      ) : (
        <>
          {contsList && contsTotalCount && contsTotalCount > 0 && (
            <Text type="subtitle" sx={{ mb: 2, mt: 3 }}>
              Contractors Found{" "}
              <span
                style={{ color: primaryC }}
              >{`(${contsList?.length}/${contsTotalCount})`}</span>
            </Text>
          )}
          <ContractorsCards users={contsList} loading={contsLoading} />
          {/* {contsTotalCount && contsTotalCount > pageSize && ( */}
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            sx={{ display: "flex", justifyContent: "center", mt: 2 }}
          />
          {/* )} */}
        </>
      )}
      <NearbyContsFilters
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
