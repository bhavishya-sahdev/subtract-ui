import { Link } from "@remix-run/react";

import { GearIcon } from "@radix-ui/react-icons";
import { Input } from "~/components/ui/input";
import { LogOut } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { routes } from "~/lib/routes";

const MainNav = () => {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4 lg:space-x-6 mx-4">
          <Link
            to={routes.dashboard.overview}
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Overview
          </Link>
          <Link
            to={routes.dashboard.details}
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Details
          </Link>
          <Link
            to={routes.dashboard.settings}
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Settings
          </Link>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Input
            type="search"
            placeholder="Search..."
            className="md:w-[100px] lg:w-[300px]"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar>
                  <AvatarFallback>HW</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Homework</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    m@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to={routes.dashboard.settings}>
                <DropdownMenuItem>
                  <GearIcon className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </Link>
              <Link to={routes.auth.login}>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default MainNav;
