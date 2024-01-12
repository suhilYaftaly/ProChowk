export const userFields = `id name phoneNum bio email emailVerified provider roles userTypes createdAt updatedAt`;

export const contractorFields = `id createdAt updatedAt`;

export const imageFields = `id name size type url createdAt updatedAt`;

export const licenseFields = `id name type size url createdAt updatedAt`;

export const skillFields = `id label createdAt updatedAt`;

//address
// const geoJsonFields = `type coordinates`;
export const geocodeFields = `displayName street city county state stateCode postalCode country countryCode lat lng`;
export const addressFields = `id ${geocodeFields} lat lng createdAt updatedAt`;

//job
export const jobBudgetFields = `id type from to maxHours createdAt updatedAt`;
export const jobFields = `id title desc jobSize status startDate endDate isDraft draftExpiry createdAt updatedAt userId`;

export const jobBidFields = `id quote startDate proposal isAccepted isRejected rejectionReason agreementAccepted createdAt updatedAt jobId contractorId`;
