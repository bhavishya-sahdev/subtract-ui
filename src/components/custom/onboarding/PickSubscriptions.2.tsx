import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function PickSubscriptions() {
  return (
    <div>
      <p className="text-2xl">Add subscriptions</p>
      <p>
        Pick from the list below to get you started. You can always skip this
        step.
      </p>
      <Card className="mt-4">
        <CardContent className="p-4 flex gap-4 flex-wrap">
          <div className="flex flex-col items-center gap-1">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn1.png" alt="@shadcn" />
              <AvatarFallback>N</AvatarFallback>
            </Avatar>
            <Label>Netflix</Label>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>H</AvatarFallback>
            </Avatar>
            <Label>Hulu</Label>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>AP</AvatarFallback>
            </Avatar>
            <Label className="text-ellipsis max-w-20 text-center">
              Amazon Prime
            </Label>
          </div>
        </CardContent>
      </Card>
      <Button className="mt-4">Skip or Next</Button>
    </div>
  );
}
