import {ScreenBufferType, Status, Weight, Brightness} from "../../Enums";
import {colors, panel as panelColor, background as backgroundColor, colorValue} from "./colors";
import {TabHoverState} from "../TabComponent";
import {darken, lighten, failurize} from "./functions";
import {Attributes} from "../../Interfaces";
import {suggestionsLimit} from "../../Autocompletion";
import {objectValues} from "../../utils/Common";

export {toDOMString} from "./functions";

export interface CSSObject {
    pointerEvents?: string;
    marginTop?: number;
    marginBottom?: number;
    padding?: string | number;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    minHeight?: number;
    height?: number | string;
    margin?: number | string;
    listStyleType?: "none";
    backgroundColor?: string;
    cursor?: "pointer" | "help" | "progress";
    color?: string;
    width?: string | number;
    flex?: number;
    overflow?: "hidden";
    overflowX?: "scroll";
    outline?: "none";
    opacity?: number;
    boxShadow?: string;
    zoom?: number;
    position?: "fixed" | "relative" | "absolute";
    top?: number | "auto";
    bottom?: number | "auto";
    left?: number;
    right?: number;
    whiteSpace?: "pre-wrap";
    zIndex?: number;
    gridArea?: string;
    display?: "grid" | "inline-block";
    gridTemplateAreas?: string;
    gridTemplateRows?: "auto";
    gridTemplateColumns?: string;
    transition?: string;
    animation?: string;
    backgroundImage?: string;
    backgroundSize?: string | number;
    content?: string;
    transformOrigin?: string;
    transform?: string;
    textDecoration?: "underline";
    fontWeight?: "bold";
    fontSize?: number;
    WebkitFontFeatureSettings?: '"liga", "dlig"';
    WebkitAppearance?: "none";
}

abstract class Unit {
    abstract toCSS(): string;
}

class Px extends Unit {
    constructor(private number: number) {
        super();
    }

    toCSS(): string {
        return `${this.number}px`;
    }
}

class Fr extends Unit {
    constructor(private number: number) {
        super();
    }

    toCSS(): string {
        return `${this.number}fr`;
    }
}

type GridSize = Px | Fr;

interface GridArea {
    name: string;
    width: GridSize;
}

interface Grid {
    areas: Dictionary<GridArea>;
    name: string;
}

const fontSize = 14;
export const outputPadding = 10;
const promptVerticalPadding = 5;
const promptHorizontalPadding = 10;
const promptHeight = 12 + (2 * promptVerticalPadding);
export const promptWrapperHeight = promptHeight + promptVerticalPadding;
const promptBackgroundColor = lighten(colors.black, 5);
const suggestionSize = 2 * fontSize;
const defaultShadow = "0 2px 8px 1px rgba(0, 0, 0, 0.3)";
export const titleBarHeight = 24;
export const rowHeight = fontSize + 4;
export const infoPanelHeight = 2 * fontSize + 4;
export const letterWidth = fontSize / 2 + 1.5;

const infoPanel = {
    paddingTop: 8,
    paddingRight: 0,
    paddingBottom: 6,
    paddingLeft: 0.6 * fontSize,
    minHeight: infoPanelHeight,
    lineHeight: 1.3,
    backgroundColor: panelColor,
};

const inactiveJobs: CSSObject = {
    pointerEvents: "none",
};

const icon = {
    fontFamily: "FontAwesome",
};

const outputCutHeight = fontSize * 2.6;
const outputCutZIndex = 0;

const decorationWidth = 30;
const arrowZIndex = 2;
const progressBarStripesSize = 30;
const arrowColor = lighten(promptBackgroundColor, 10);

const promptGrid = {
    name: "prompt",
    areas: {
        decoration: {
            name: "decoration",
            width: new Px(decorationWidth),
        },
        prompt: {
            name: "prompt",
            width: new Fr(1),
        },
        actions: {
            name: "actions",
            width: new Px(150),
        },
    },
};

const promptInlineElement: CSSObject = {
    paddingTop: 0,
    paddingRight: promptHorizontalPadding,
    paddingBottom: 3,
    paddingLeft: promptHorizontalPadding,
    gridArea: promptGrid.areas.prompt.name,
    fontSize: fontSize,
    WebkitFontFeatureSettings: '"liga", "dlig"',
    whiteSpace: "pre-wrap",
    WebkitAppearance: "none",
    outline: "none",
};

function gridTemplateAreas(grid: Grid) {
    return `'${objectValues(grid.areas).map(area => area.name).join(" ")}'`;
}

function gridTemplateColumns(grid: Grid) {
    return `${objectValues(grid.areas).map(area => area.width.toCSS()).join(" ")}`;
}

function tabCloseButtonColor(hover: TabHoverState) {
    if (hover === TabHoverState.Close) {
        return colors.red;
    } else if (hover === TabHoverState.Tab) {
        return colors.white;
    } else {
        return "transparent";
    }
}

function jaggedBorder(color: string, panelColor: string, darkenPercent: number) {
    return {
        background: `-webkit-linear-gradient(${darken(panelColor, darkenPercent)} 0%, transparent 0%) 0 100% repeat-x,
                     -webkit-linear-gradient(135deg, ${color} 33.33%, transparent 33.33%) 0 0 / 15px 50px,
                     -webkit-linear-gradient(45deg, ${color} 33.33%, ${darken(panelColor, darkenPercent)} 33.33%) 0 0 / 15px 50px`,
    };
}

export const application = {
    backgroundColor: backgroundColor,
    color: colors.white,
    fontFamily: "'Hack', 'Fira Code', 'Menlo', monospace",
    fontSize: fontSize,
};

export const jobs = (isSessionActive: boolean): CSSObject =>
    isSessionActive ? {} : inactiveJobs;

export const row = (jobStatus: Status, activeScreenBufferType: ScreenBufferType) => {
    const style: CSSObject = {
        padding: `0 ${outputPadding}`,
        minHeight: rowHeight,
    };

    if (activeScreenBufferType === ScreenBufferType.Alternate) {
        if ([Status.Failure, Status.Interrupted, Status.Success].includes(jobStatus)) {
            style.height = 70;
        } else if (Status.InProgress === jobStatus) {
            style.margin = 0;
        }
    }

    return style;
};

export const autocompletionDescription = Object.assign(
    {
        display: "block",
        boxShadow: "0 4px 8px 1px rgba(0, 0, 0, 0.3)",
        position: "absolute",
        left: 0,
        right: 0,
        fontSize: "0.8em",
    },
    infoPanel
);

export const suggestionIcon = Object.assign(
    {},
    icon,
    {
        display: "inline-block",
        width: suggestionSize,
        height: suggestionSize,
        lineHeight: "2em",
        verticalAlign: "middle",
        textAlign: "center",
        fontStyle: "normal",
        opacity: ".5",
        marginRight: 10,
        backgroundColor: "rgba(0, 0, 0, 0.15)",
    }
);

export const autocomplete = {
    box: (offsetTop: number, caretPosition: number, hasDescription: boolean) => {
        const shouldDisplayAbove = offsetTop + (suggestionsLimit * suggestionSize) > window.innerHeight;

        return {
            position: "absolute",
            top: shouldDisplayAbove ? "auto" : promptWrapperHeight,
            bottom: shouldDisplayAbove ? suggestionSize + (hasDescription ? suggestionSize : 0) : "auto",
            left: decorationWidth + promptHorizontalPadding + (caretPosition * letterWidth),
            minWidth: 300,
            boxShadow: defaultShadow,
            backgroundColor: colors.black,
            zIndex: 3,
        };
    },
    synopsis: {
        float: "right",
        opacity: 0.5,
        fontSize: "0.8em",
        marginTop: "0.65em",
        marginRight: 5,
    },
    value: {
        paddingRight: 30,
    },
    item: (isHighlighted: boolean) => {
        const style: CSSObject = {
            listStyleType: "none",
            padding: 2,
            cursor: "pointer",
        };

        if (isHighlighted) {
            style.backgroundColor = "#383E4A";
        }

        return style;
    },
    suggestionsList: {
        maxHeight: 300,
        overflow: "auto",
        padding: 0,
        margin: 0,
    },
};

export const statusLine = {
    itself: Object.assign(
        {},
        infoPanel,
        {
            position: "fixed",
            bottom: 0,
            width: "100%",
            zIndex: 3,
        }
    ),
    presentDirectory: {
        display: "inline-block",
    },
    vcsData: {
        display: "inline-block",
        float: "right",
        marginRight: 10,
    },
    icon: Object.assign({}, icon, {marginRight: 5}),
    status: (status: VcsStatus) => {
        return {
            color: status === "dirty" ? colors.blue : colors.white,
            display: "inline-block",
        };
    },
};

export const session = (isActive: boolean) => {
    const styles: CSSObject = {
        height: "100%",
        width: "100%",
        flex: 1,
        overflowX: "scroll",
    };

    if (isActive) {
        styles.outline = "none";
    } else {
        styles.opacity = 0.4;
        styles.boxShadow = `0 0 0 1px ${colors.white}`;
        styles.margin = "0 0 1px 1px";
    }

    return styles;
};

export const activeTabContent = {
    display: "flex",
    flexWrap: "nowrap",
    flexDirection: "column",
    position: "absolute",
    width: "100%",
    top: titleBarHeight,
    backgroundColor: backgroundColor,
    bottom: statusLine.itself.minHeight,
};

export const tabs = {
    height: titleBarHeight,
    display: "flex",
    justifyContent: "center",
    WebkitAppRegion: "drag",
    WebkitMarginBefore: 0,
    WebkitMarginAfter: 0,
    WebkitPaddingStart: 0,
    WebkitUserSelect: "none",
};

export const tab = (isHovered: boolean, isActive: boolean) => {
    return {
        backgroundColor: isHovered ? panelColor : colors.black,
        opacity: (isHovered || isActive) ? 1 : 0.3,
        position: "relative",
        height: titleBarHeight,
        width: 150,
        display: "inline-block",
        textAlign: "center",
        paddingTop: 2,
    };
};

export const tabClose = (hover: TabHoverState) => {
    const margin = titleBarHeight - fontSize;

    return Object.assign(
        {},
        icon,
        {
            color: tabCloseButtonColor(hover),
            position: "absolute",
            left: margin,
            top: margin / 2,
        }
    );
};

export const commandSign = {
    fontSize: fontSize + 3,
    verticalAlign: "middle",
};

// To display even empty rows. The height might need tweaking.
// TODO: Remove if we always have a fixed screenBuffer width.
export const charGroup = (attributes: Attributes, status: Status) => {
    const styles: CSSObject = {
        display: "inline-block",
        height: rowHeight,
        color: colorValue(attributes.color, {isBright: attributes.brightness === Brightness.Bright}),
        backgroundColor: [Status.Failure, Status.Interrupted].includes(status) ? failurize(backgroundColor) : colorValue(attributes.backgroundColor),
    };

    if (attributes.inverse) {
        const color = styles.color;

        styles.color = styles.backgroundColor;
        styles.backgroundColor = color;
    }

    if (attributes.underline) {
        styles.textDecoration = "underline";
    }

    if (attributes.weight === Weight.Bold) {
        styles.fontWeight = "bold";
    }

    if (attributes.cursor) {
        styles.backgroundColor = colors.white;
        styles.color = colors.black;
    }

    return styles;
};

export const outputCut = (status: Status, isHovered: boolean) => Object.assign(
    {},
    jaggedBorder(
        [Status.Failure, Status.Interrupted].includes(status) ? failurize(backgroundColor) : backgroundColor,
        [Status.Failure, Status.Interrupted].includes(status) ? failurize(panelColor) : panelColor,
        isHovered ? 0 : 0
    ),
    {
        position: "relative",
        top: -outputPadding,
        left: -outputPadding,
        width: "102%",
        height: outputCutHeight,
        textAlign: "center",
        paddingTop: (outputCutHeight - fontSize) / 3,
        color: lighten(backgroundColor, isHovered ? 35 : 30),
        cursor: "pointer",
        zIndex: outputCutZIndex,
    }
);

export const outputCutIcon = Object.assign({marginRight: 10}, icon);

export const output = (activeScreenBufferType: ScreenBufferType, status: Status) => {
    const styles: CSSObject = {
        paddingTop: outputPadding,
        paddingBottom: outputPadding,
        paddingLeft: activeScreenBufferType === ScreenBufferType.Alternate ? 0 : outputPadding,
        paddingRight: activeScreenBufferType === ScreenBufferType.Alternate ? 0 : outputPadding,
        whiteSpace: "pre-wrap",
        backgroundColor: backgroundColor,
    };

    if (activeScreenBufferType === ScreenBufferType.Alternate) {
        if ([Status.Failure, Status.Interrupted, Status.Success].includes(status)) {
            styles.zoom = 0.1;
        }

        if (status === Status.InProgress) {
            styles.position = "fixed";
            styles.top = titleBarHeight;
            styles.bottom = infoPanelHeight;
            styles.left = 0;
            styles.right = 0;
            styles.zIndex = 4;

            styles.margin = 0;
            styles.padding = "5px 0 0 0";
        }
    } else {
        if ([Status.Failure, Status.Interrupted].includes(status)) {
            styles.backgroundColor = failurize(backgroundColor);
        }
    }

    return styles;
};

export const promptWrapper = (status: Status, isSticky: boolean) => {
    const styles: CSSObject = {
        top: 0,
        paddingTop: promptVerticalPadding,
        position: "relative", // To position the autocompletion box correctly.
        display: "grid",
        gridTemplateAreas: gridTemplateAreas(promptGrid),
        gridTemplateRows: "auto",
        gridTemplateColumns: gridTemplateColumns(promptGrid),
        backgroundColor: promptBackgroundColor,
        minHeight: promptWrapperHeight,
        zIndex: outputCutZIndex + 1,
    };

    if (isSticky) {
        styles.boxShadow = "0 5px 8px -3px rgba(0, 0, 0, 0.3)";
        styles.width = "100%";
        styles.position = "fixed";
        styles.top = titleBarHeight;
    }

    if ([Status.Failure, Status.Interrupted].includes(status)) {
        styles.backgroundColor = failurize(promptBackgroundColor);
    }

    return styles;
};

export const arrow = (status: Status) => {
    const styles: CSSObject = {
        gridArea: promptGrid.areas.decoration.name,
        position: "relative",
        width: decorationWidth,
        height: promptHeight - promptVerticalPadding,
        margin: "0 auto",
        overflow: "hidden",
        zIndex: arrowZIndex,
    };

    if (status === Status.InProgress) {
        styles.cursor = "progress";
    }

    return styles;
};

export const promptInfo = (status: Status) => {
    const styles: CSSObject = {
        cursor: "help",
        zIndex: 2,
        gridArea: promptGrid.areas.decoration.name,
    };

    if (status === Status.Interrupted) {
        Object.assign(styles, icon);

        styles.position = "relative";
        styles.left = 6;
        styles.top = 1;
        styles.color = colors.black;
    }

    return styles;
};

export const actions = {
    gridArea: promptGrid.areas.actions.name,
    marginRight: 15,
    textAlign: "right",
};

export const action = Object.assign(
    {
        textAlign: "center",
        width: fontSize,
        display: "inline-block",
        margin: "0 3px",
        cursor: "pointer",
    },
    icon
);

export const decorationToggle = (isEnabled: boolean) => {
    return Object.assign(
        {},
        action,
        {
            color: isEnabled ? colors.green : colors.white,
        }
    );
};

export const autocompletedPreview = Object.assign(
    {},
    promptInlineElement,
    {
        color: lighten(promptBackgroundColor, 15),
    }
);

export const prompt = Object.assign(
    {},
    promptInlineElement,
    {
        color: colors.white,
        zIndex: 2,
    }
);

export const promptPlaceholder = {
    height: promptWrapperHeight,
};

export const arrowInner = (status: Status) => {
    const styles: CSSObject = {
        content: "",
        position: "absolute",
        width: "200%",
        height: "200%",
        top: -11,
        right: -8,
        backgroundColor: arrowColor,
        transformOrigin: "54% 0",
        transform: "rotate(45deg)",
        zIndex: arrowZIndex - 1,

        backgroundSize: 0, // Is used to animate the inProgress arrow.
    };

    if (status === Status.InProgress) {
        const color = lighten(colors.black, 3);

        styles.transition = "background 0.1s step-end 0.3s";
        styles.animation = "progress-bar-stripes 0.5s linear infinite";
        styles.backgroundImage = `linear-gradient(45deg, ${color} 25%, transparent 25%, transparent 50%, ${color} 50%, ${color} 75%, transparent 75%, transparent)`;
        styles.backgroundSize = `${progressBarStripesSize}px ${progressBarStripesSize}px`;
    }

    if ([Status.Failure, Status.Interrupted].includes(status)) {
        styles.backgroundColor = failurize(arrowColor);
    }

    return styles;
};
