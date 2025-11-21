import { useRouter } from "expo-router";

export const validateCnic = (cnic) => {
  return typeof cnic === "string" && cnic.trim().length === 15;
};

export const validateVoter = (voter) => {
  const router = useRouter();
  if (!voter?.canVote || voter?.IsVoted) return router.push("/");
};
