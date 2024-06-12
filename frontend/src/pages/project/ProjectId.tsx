import MainLayout from '../MainLayout';
import { Project } from '@/widgets/Project';
import ProjectLayout from './ProjectLayout';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import $api from '@/app/http/axios';
import { useInitProjectStore } from '@/entities/project/model/initProjectStore';
import { useProjectStore } from '@/entities/project';

const ProjectId = () => {
    const { id } = useParams();
    const [loaded, setLoaded] = useState(false);
    const setStartJSON = useInitProjectStore(
        (state) => state.setSerializedJSON,
    );
    const setProject = useProjectStore((state) => state.setProject);

    useEffect(() => {
        const fetchProject = async () => {
            if (id == 'tmp') {
                setProject({
                    _id: 'tmp',
                    title: 'Temporary project',
                    width: 0,
                    height: 0,
                });
                setLoaded(true);
                return;
            }
            const resp = await $api.get(`/project/${id}`);
            const data = resp.data;
            setStartJSON(null);
            if (data.projectJSON) setStartJSON(data.projectJSON);
            setProject(data);
            setLoaded(true);
        };

        fetchProject();
    }, [id, setProject, setStartJSON]);

    return (
        <MainLayout>
            <ProjectLayout>
                <div
                    className="flex h-full w-full flex-col items-center justify-center "
                    id="workingSpace"
                >
                    {loaded && <Project />}
                </div>
            </ProjectLayout>
        </MainLayout>
    );
};

export default ProjectId;
