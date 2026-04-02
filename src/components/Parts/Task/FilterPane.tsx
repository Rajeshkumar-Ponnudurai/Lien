import { Filter, Search, X } from "lucide-react"
import { useGetTaskActionsQuery } from "../../../features/task/taskDataApi";

type FilterPaneProps = {
    search: string;
    setSearch: (search: string) => void;
    filterStatus: string;
    setFilterStatus: (status: string) => void;
}

const FilterPane = (props: FilterPaneProps) => {
    const { filterStatus, setFilterStatus, search, setSearch } = props;

    const { data: taskActionData } = useGetTaskActionsQuery();

    const handleClearFilter = () => {
        setSearch('');
        setFilterStatus('all');
    }

    return (
        <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 mb-6">

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <Filter className="w-5 h-5 text-slate-600" />
                <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                    Filters
                </h3>
            </div>
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">

                {/* Search */}
                <div className="flex-1 relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />

                    <input
                        type="text"
                        placeholder="Search by project, customer, or contact..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="
                      w-full
                      pl-9 sm:pl-10 pr-4
                      py-2 sm:py-2.5
                      text-sm sm:text-base
                      border border-slate-300 rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    "
                    />
                </div>


                {/* Filters */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 w-full lg:w-auto">

                    {/* Status Filter */}
                    <div className="relative w-full sm:w-auto">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="
                        w-full sm:w-auto
                        pl-9 pr-8
                        py-2 sm:py-2.5
                        text-sm sm:text-base
                        border border-slate-300 rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        appearance-none bg-white cursor-pointer
                      "
                        >
                            <option value="all">All Task Actions</option>
                            {taskActionData?.data.map((action) => (
                                <option key={action.id} value={action.id}>
                                    {action.name}
                                </option>
                            ))}
                        </select>
                    </div>


                    {/* Clear Button */}
                    {(filterStatus !== 'all' || search !== '') && (
                        <button
                            onClick={handleClearFilter}
                            className="
                        w-full sm:w-auto
                        flex items-center justify-center gap-2
                        px-4 py-2 sm:py-2.5
                        text-sm sm:text-base
                        text-slate-700 bg-slate-100 hover:bg-slate-200
                        rounded-lg transition-colors
                      "
                        >
                            <X className="w-4 h-4" />
                            Clear
                        </button>
                    )}

                </div>

            </div>

            {/* Filters */}

        </div>
    )
}

export default FilterPane