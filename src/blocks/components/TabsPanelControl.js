import { TabPanel } from "@wordpress/components";

function TabsPanelControl({ tabs }) {
	return (
		<TabPanel className="ub-tab-panels" tabs={tabs}>
			{(tab) => tab.component}
		</TabPanel>
	);
}
export default TabsPanelControl;
