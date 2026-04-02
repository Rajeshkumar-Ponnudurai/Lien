import { AlertCircle, Calendar, CheckSquare, Clock, Eye, FileText, Lightbulb, TrendingUp, Users } from "lucide-react";
import { useGetAllDeadlinesQuery } from "../../features/project/ProjectDeadlineApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import DeadlineViewModal, { DeadlineDetails } from "../modals/DeadlineViewModal";

const DeadlineScreen = () => {

    const [selectedDeadline, setSelectedDeadline] = useState<DeadlineDetails | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const projectId = searchParams.get("projectId");

    const { data: deadlines, isLoading } = useGetAllDeadlinesQuery(projectId);
    const navigate = useNavigate();

    const projects = deadlines?.data ?? [];

    const getUrgencyColor = (days: number) => {
        if (days < 0) return 'bg-red-100 border-red-300 text-red-900';
        if (days <= 7) return 'bg-orange-100 border-orange-300 text-orange-900';
        if (days <= 14) return 'bg-yellow-100 border-yellow-300 text-yellow-900';
        return 'bg-green-100 border-green-300 text-green-900';
    };

    const stats = useMemo(() => {
        if (!projects.length) {
            return {
                totalProjects: 0,
                overdueProjects: 0,
                upcomingDeadlines: 0,
                thisWeek: 0
            };
        }

        let overdueProjects = 0;
        let upcomingDeadlines = 0;
        let thisWeek = 0;

        projects.forEach(project => {

            if (project.is_late) {
                overdueProjects++;
            }

            project.deadlines?.forEach((d: any) => {

                if (!d.is_late && d.daysRemaining <= 30) {
                    upcomingDeadlines++;
                }

                if (!d.is_late && d.daysRemaining <= 7) {
                    thisWeek++;
                }

            });

        });

        return {
            totalProjects: projects.length,
            overdueProjects,
            upcomingDeadlines,
            thisWeek
        };

    }, [projects]);

    const clearProjectFilter = () => {
        searchParams.delete("projectId");
        setSearchParams(searchParams);
    };

    const projectHighlights = useMemo(() => {
        const projects = deadlines?.data ?? [];

        return projects.map((project: any) => {

            if (!project.deadlines?.length) return null;

            const overdue = project.deadlines.filter((d: any) => d.is_late);
            const upcoming = project.deadlines.filter((d: any) => !d.is_late);

            let selectedDeadline = null;

            if (overdue.length > 0) {
                // pick most overdue (largest daysRemaining)
                selectedDeadline = overdue.sort(
                    (a: any, b: any) => Number(b.daysRemaining) - Number(a.daysRemaining)
                )[0];
            } else if (upcoming.length > 0) {
                // pick nearest upcoming (smallest daysRemaining)
                selectedDeadline = upcoming.sort(
                    (a: any, b: any) => Number(a.daysRemaining) - Number(b.daysRemaining)
                )[0];
            }

            return {
                project_id: project.project_id,
                project_name: project.project_name,
                is_late: project.is_late,
                deadline: selectedDeadline
            };

        }).filter(Boolean);

    }, [deadlines]);

    const overdueProjects = useMemo(() => {
        return projectHighlights.filter((p: any) => p.is_late);
    }, [projectHighlights]);

    const upcomingProjects = useMemo(() => {
        return projectHighlights.filter((p: any) => !p.is_late);
    }, [projectHighlights]);

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Project Deadlines</h1>
                <p className="text-lg text-slate-600">
                    Track all upcoming and overdue deadlines across your projects
                </p>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg border border-orange-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-600 mb-1">Upcoming (30 days)</p>
                            <p className="text-2xl font-bold text-orange-600">{stats.upcomingDeadlines}</p>
                        </div>
                        <Clock className="w-8 h-8 text-orange-600 opacity-20" />
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-red-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-600 mb-1">Overdue</p>
                            <p className="text-2xl font-bold text-red-600">{stats.overdueProjects}</p>
                        </div>
                        <AlertCircle className="w-8 h-8 text-red-600 opacity-20" />
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-blue-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-600 mb-1">Total Active</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.totalProjects}</p>
                        </div>
                        <Calendar className="w-8 h-8 text-blue-600 opacity-20" />
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-green-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-600 mb-1">This Week</p>
                            <p className="text-2xl font-bold text-green-600">
                                {stats.thisWeek}
                            </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-600 opacity-20" />
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-slate-600">Loading deadlines...</p>
                    </div>
                </div>
            ) : (
                projects.length > 0 && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-5 mb-6">
                        <div className="flex items-start gap-3">
                            <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-slate-900 mb-3">Tips & Recommended Actions</h3>
                                <div className="space-y-2 text-sm text-slate-700 mb-4">

                                    <div className="flex items-start gap-2">
                                        <span className="text-red-600">•</span>
                                        <p><strong>Urgent:</strong> You have {stats.overdueProjects} overdue deadline{stats.overdueProjects !== 1 ? 's' : ''}. Address these immediately to avoid complications or penalties.</p>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <span className="text-blue-600">•</span>
                                        <p><strong>Best Practice:</strong> Set email reminders 7-14 days before important filing deadlines to ensure adequate preparation time.</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-green-600">•</span>
                                        <p><strong>Stay Ahead:</strong> Review project documents and verify recipient information well in advance to avoid last-minute complications.</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-indigo-600">•</span>
                                        <p><strong>Documentation:</strong> Keep copies of all filed notices and track delivery confirmations for your records and compliance.</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 pt-2 border-t border-blue-200">
                                    <button
                                        onClick={() => navigate("/documents")}
                                        className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-1.5 
               px-3 py-2 sm:py-1.5 
               bg-white text-blue-700 text-xs sm:text-sm font-medium 
               rounded-lg hover:bg-blue-100 transition-colors 
               border border-blue-300"
                                    >
                                        <FileText className="w-4 sm:w-3.5 h-4 sm:h-3.5" />
                                        Review Documents
                                    </button>
                                    <button
                                        onClick={
                                            () => navigate("/tasks")
                                        }
                                        className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-1.5 
               px-3 py-2 sm:py-1.5 
               bg-white text-blue-700 text-xs sm:text-sm font-medium 
               rounded-lg hover:bg-blue-100 transition-colors 
               border border-blue-300"
                                    >
                                        <CheckSquare className="w-4 sm:w-3.5 h-4 sm:h-3.5" />
                                        View All Tasks
                                    </button>
                                    <button
                                        onClick={() => navigate("/contacts")}
                                        className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-1.5 
               px-3 py-2 sm:py-1.5 
               bg-white text-blue-700 text-xs sm:text-sm font-medium 
               rounded-lg hover:bg-blue-100 transition-colors 
               border border-blue-300"
                                    >
                                        <Users className="w-4 sm:w-3.5 h-4 sm:h-3.5" />
                                        Verify Contacts
                                    </button>
                                </div>
                            </div>
                        </div>
                        {projectId && (
                            <div className="my-4 flex items-center justify-between bg-orange-50 border border-orange-200 px-4 py-2 rounded-lg">
                                <p className="text-sm text-orange-900">
                                    Project filter is applied
                                </p>

                                <button
                                    onClick={clearProjectFilter}
                                    className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Remove Filter
                                </button>
                            </div>
                        )}
                        {overdueProjects.length > 0 &&
                            <div className="my-6">
                                <h2 className="text-lg font-bold text-red-600 mb-3 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Overdue Deadlines
                                </h2>
                                <div className="space-y-2">
                                    {overdueProjects?.map((deadline) => {
                                        return (
                                            <div
                                                key={deadline?.project_id}
                                                className="bg-white border-2 border-red-300 rounded-lg p-3 hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-slate-900 text-sm sm:text-base truncate">{deadline?.deadline?.title}</h3>
                                                        <h5 className="font-semibold text-slate-800 text-sm truncate">
                                                            {deadline?.deadline?.requirement}
                                                        </h5>
                                                        <p className="text-xs text-slate-600 truncate">{deadline?.project_name}</p>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-2">
                                                        <div className="flex items-center justify-between sm:block text-xs">
                                                            <p className="text-xs text-slate-500">{deadline?.deadline.date}</p>
                                                            <span className="inline-block px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                                                {deadline?.deadline?.daysRemaining} overdue
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => setSelectedDeadline(deadline)}
                                                            className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-1 
                           px-3 py-1.5 bg-red-50 text-red-700 text-xs sm:text-sm font-medium 
                           rounded hover:bg-red-100 transition-colors"
                                                        >
                                                            <Eye className="w-4 sm:w-3.5 h-4 sm:h-3.5" />
                                                            View
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        }
                        {upcomingProjects.length > 0 &&
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Upcoming Deadlines
                                </h2>
                                <div className="space-y-2">
                                    {upcomingProjects.map((deadline) => {
                                        return (
                                            <div
                                                key={deadline?.project_id}
                                                className={`border-2 rounded-lg p-3 hover:shadow-md transition-shadow ${getUrgencyColor(deadline?.deadline.daysRemaining)}`}
                                            >
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-sm truncate">{deadline?.deadline?.title}</h3>
                                                        <h5 className="font-semibold text-sm truncate">{deadline?.deadline?.requirement}</h5>
                                                        <p className="text-xs opacity-80 truncate">{deadline?.project_name}</p>

                                                    </div>
                                                    <div className="flex items-center gap-3 flex-shrink-0">
                                                        <div className="text-right">
                                                            <p className="text-xs opacity-70">{deadline?.deadline?.date}</p>
                                                            <span className="text-xs font-medium">
                                                                {`${deadline?.deadline.daysRemaining}d left`}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => setSelectedDeadline(deadline)}
                                                            className="flex items-center gap-1 px-2 py-1 bg-white/50 text-current text-xs font-medium rounded hover:bg-white/80 transition-colors"
                                                        >
                                                            <Eye className="w-3 h-3" />
                                                            View
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        }
                    </div>
                )
            )}
            {selectedDeadline !== null &&
                <DeadlineViewModal isOpen={selectedDeadline !== null} onClose={() => setSelectedDeadline(null)} data={selectedDeadline} />
            }
        </div>
    )
}

export default DeadlineScreen