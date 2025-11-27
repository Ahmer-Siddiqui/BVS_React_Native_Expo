import { useRouter } from "expo-router";

export const validateCnic = (cnic) => {
  return typeof cnic === "string" && cnic.trim().length === 15;
};

export const validateVoter = (voter) => {
  if (!voter?.canVote || voter?.IsVoted) return router.push("/");
};
