import { useDatePlanning } from "src/providers/datePlanning"
import { ErrorBlock } from "src/helpers/errors"
import Planning from "src/components/Planning"
import { orderSlotsByDate } from "src/helpers/planning"

const PlanningBdmPage = () => {
  const { data, error } = useDatePlanning()
  if (error) {
    return <ErrorBlock error={error} />
  }

  const slots = data?.creneaus.filter(({ horsMag }) => horsMag).sort(orderSlotsByDate)

  return <Planning slots={slots} />
}

export default PlanningBdmPage
