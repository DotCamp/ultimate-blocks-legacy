/**
 * WordPress Dependencies
 */
import { isEmpty } from "lodash";
import { __ } from "@wordpress/i18n";
import {
  useBlockEditContext,
  __experimentalSpacingSizesControl as SpacingSizesControl,
} from "@wordpress/block-editor";
import { useSelect, useDispatch } from "@wordpress/data";
import { __experimentalToolsPanelItem as ToolsPanelItem } from "@wordpress/components";

function SpacingControlWithToolsPanel({
  label,
  attrKey,
  showByDefault = false,
  minimumCustomValue = 0,
}) {
  const { clientId } = useBlockEditContext();

  const attributes = useSelect((select) =>
    select("core/block-editor").getBlockAttributes(clientId)
  );
  const { updateBlockAttributes } = useDispatch("core/block-editor");
  const setAttributes = (newAttributes) => {
    updateBlockAttributes(clientId, newAttributes);
  };
  return (
    <>
      <ToolsPanelItem
        panelId={clientId}
        isShownByDefault={showByDefault}
        resetAllFilter={() => {
          setAttributes({
            [attrKey]: {},
          });
        }}
        className={"tools-panel-item-spacing"}
        label={label}
        onDeselect={() => setAttributes({ [attrKey]: {} })}
        hasValue={() => !isEmpty(attributes[attrKey])}
      >
        <SpacingSizesControl
          minimumCustomValue={minimumCustomValue}
          allowReset={true}
          label={label}
          values={attributes[attrKey]}
          sides={["top", "right", "bottom", "left"]}
          onChange={(newValue) => {
            setAttributes({
              [attrKey]: newValue,
            });
          }}
        />
      </ToolsPanelItem>
    </>
  );
}

export default SpacingControlWithToolsPanel;
