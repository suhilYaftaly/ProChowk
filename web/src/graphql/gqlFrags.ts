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

export const jobBidFields = `id quote startDate endDate proposal rejectionReason agreementAccepted status createdAt updatedAt jobId contractorId`;

export const notificationFields = `id title message read type readDate data createdAt updatedAt userId`;

// Chat
export const conversationFields = `id participants {id hasSeenLatestMessage} messages {id body} latestMessage {id body sender { id name } createdAt} createdAt updatedAt`;
export const messageFields = `id conversationId body senderId isLatestIn attachmentId createdAt updatedAt`;

//available fields: `id rating comment createdAt updatedAt reviewerId reviewedId`
export const reviewFields = `id rating comment updatedAt`;
