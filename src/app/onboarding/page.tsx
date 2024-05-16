import AddDetails from "@/components/custom/onboarding/AddDetails.3";
import GetStarted from "@/components/custom/onboarding/GetStarted.1";
import PickSubscriptions from "@/components/custom/onboarding/PickSubscriptions.2";

export default function Onboard() {
  return (
    <div className="h-full flex mx-auto justify-center flex-col gap-4 max-w-sm">
      <GetStarted />
      <PickSubscriptions />
      <AddDetails />
    </div>
  );
}
