/* import { ISearchFilters } from "@/components/jobs/searchJobs/NearbyJobsFilters"; */
import { BudgetType, JobInput } from '@gqlOps/job';
import { INearbyContFilters } from '../components/user/drawer/FilterDrawerContent';
/* import { INearbyContFilters } from "@/components/user/contractor/NearbyContsFilters"; */

/**whole page padding */
export const pp = 2;
/**page padding horizontal */
export const ppx = 2;
/**page padding vertical */
export const ppy = 2;
/**page content max width, can be used as a wrapper for multiple sections */
export const maxWidthPG = 1128;

const minimumWage = 14;

/**phone country code */
export const phoneCC = 'CA';

/**Dashboard search nearby jobs filter configs */
/* export const searchNearbyJobsFilterConfigs = {
  minRadius: 5,
  maxRadius: 200,
  budget: {
    from: 10,
    to: 50000,
    fromMin: 10,
    fromMax: 100000,
    toMin: 10,
    toMax: 100000,
  },
  dayPostedIndex: 3,
  projectTypeIndex: 0,
  defaults: {
    radius: 50,
    address: undefined,
    latLng: undefined,
    startDate: undefined,
    endDate: undefined,
    budget: {
      types: ["Hourly", "Project"] as BudgetType[],
      from: 10,
      to: 50000,
    },
  } as ISearchFilters,
}; */
/**Dashboard search nearby contractors filter configs */
export const nearbyContsFilterConfigs = {
  minRadius: 5,
  maxRadius: 200,
  defaults: {
    radius: 50,
    address: undefined,
    latLng: undefined,
  } as INearbyContFilters,
};

/**Job post configs */
export const jobConfigs = {
  defaults: {
    /**job initial values */
    jobForm: {
      title: '',
      desc: '',
      jobSize: 'Large',
      skills: [],
      budget: {
        type: 'Project',
        from: 500,
        to: 600,
        maxHours: 150,
      },
      images: [],
      address: undefined as any,
      startDate: undefined,
      endDate: undefined,
      isDraft: true,
    } as JobInput,
    /**Reset values for when switching between budget types */
    budgetResets: {
      project: { from: 500, to: 600 },
      hourly: { from: 20, to: 30 },
    },
  },
  validations: {
    minTitle: 5,
    minSkills: 1,
    minWage: minimumWage,
    budget: { minMaxHours: 1 },
    minDesc: 10,
    maxImages: 10,
    maxDesc: 2000,
    maxImgsSize: 15, //in MBs
  },
};
