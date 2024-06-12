import { UserCard } from '@/entities/user';
import { Button } from '@/shared/ui/button';
import { Link } from 'react-router-dom';
import {
    FileIcon,
    CardStackIcon,
    HomeIcon,
    GearIcon,
    ExitIcon,
} from '@radix-ui/react-icons';
import CreateProjectModal from './CreateProject';
import { PlusCircleIcon } from 'lucide-react';

const HomeSideBar = () => {
    return (
        <div className="fixed my-4 ml-2 h-full w-[250px] rounded-lg bg-background">
            <div className="mx-4 mt-6 flex h-full flex-col">
                <UserCard />
                <div className="mt-2 w-full">
                    <CreateProjectModal className="w-full rounded-xl border-2 border-foreground px-4 py-2 text-center hover:bg-secondary">
                        <div className="flex items-center justify-center">
                            <PlusCircleIcon className="mr-2 h-5 w-5" />
                            <span>New project</span>
                        </div>
                    </CreateProjectModal>
                </div>
                <div className="mt-4 w-full">
                    <Link to="/home">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-base"
                        >
                            <HomeIcon className="mr-2 h-5 w-5" />
                            Home
                        </Button>
                    </Link>
                    <Link to="/projects">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-base"
                        >
                            <CardStackIcon className="mr-2 h-5 w-5" />
                            Projects
                        </Button>
                    </Link>
                    <Link to="/templates">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-base"
                        >
                            <FileIcon className="mr-2 h-5 w-5" />
                            Templates
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="fixed bottom-0 mx-4 mb-4 w-[220px] border-t pt-4">
                <div className="flex items-center justify-between">
                    <Link to="/settings">
                        <Button
                            variant="ghost"
                            className="flex items-center px-6 py-3 text-lg font-semibold"
                        >
                            <GearIcon className="mr-2 h-5 w-5" />
                            Settings
                        </Button>
                    </Link>
                    <Link to="/logout" className="ml-2">
                        <Button
                            variant="ghost"
                            className="flex items-center px-6 py-3 text-lg font-semibold"
                        >
                            <ExitIcon className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomeSideBar;
