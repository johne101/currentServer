import { getAvailability } from "railkit";

export const checkAvailability = async ({
  train,
  from,
  to,
  date,
  coachClass,
  quota,
}) => {
  try {
    const response = await getAvailability(
      train,
      from,
      to,
      date,
      coachClass,
      quota
    );

    if (!response.success) {
      throw new Error("RailKit request failed");
    }
console.log("response");
console.log(response);

    return response.data;
  } catch (error) {
    console.error("RailKit Error:", error.message);
    throw error;
  }
};