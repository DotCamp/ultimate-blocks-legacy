import icon from "./icon";

import save from "./save";
import { ReviewBody } from "./components";
import {
	version_1_1_2,
	version_1_1_4,
	version_1_1_5,
	updateFrom,
} from "./oldVersions";
import { removeFromArray } from "../../common";
import { useEffect, useState } from "react";
import registerPluginBlock from "$Inc/registerPluginBlock";
import { CustomFontSizePicker, SpacingControl } from "../components";
import { __ } from "@wordpress/i18n";
import {
	BlockControls,
	InspectorControls,
	PanelColorSettings,
	URLInput,
	useBlockProps,
} from "@wordpress/block-editor";

import {
	ToolbarGroup,
	ToolbarButton,
	Button,
	ButtonGroup,
	FormToggle,
	PanelBody,
	PanelRow,
	RangeControl,
	RadioControl,
	SelectControl,
	TextControl,
	DatePicker,
	ToggleControl,
} from "@wordpress/components";

import { compose } from "@wordpress/compose";
import { withSelect } from "@wordpress/data";
import metadata from "./block.json";

const defaultAttributes = {
	ID: {
		type: "string",
		default: "",
	},
	blockID: {
		type: "string",
		default: "",
	},
	authorName: {
		type: "string",
		default: "",
	},
	itemName: {
		type: "string",
		default: "",
	},
	itemType: {
		type: "string",
		default: "Product",
	},
	//for book, movie, and local business link
	itemPage: {
		type: "string",
		default: "",
	},
	itemSubtype: {
		type: "string",
		default: "",
	},
	itemSubsubtype: {
		type: "string",
		default: "",
	},
	valueType: {
		type: "string",
		default: "star", //also support percent
	},
	items: {
		type: "string",
		default: '[{"label":"","value":0}]',
	},
	description: {
		type: "string",
		default: "",
	},
	descriptionAlign: {
		type: "string",
		default: "left",
	},
	imgPosition: {
		type: "string",
		default: "right",
	},
	imgURL: {
		type: "string",
		default: "",
	},
	imgID: {
		type: "number",
	},
	imgAlt: {
		type: "string",
		default: "",
	},
	parts: {
		type: "array",
		default: [{ label: "", value: 0 }],
	},
	starCount: {
		type: "number",
		default: 5,
	},
	useSummary: {
		type: "boolean",
		default: true,
	},
	summaryTitle: {
		type: "string",
		default: "Summary",
	},
	summaryDescription: {
		type: "string",
		default: "",
	},
	callToActionText: {
		type: "string",
		default: "",
	},
	callToActionFontSize: {
		type: "number",
		default: 0,
	},
	callToActionURL: {
		type: "string",
		default: "",
	},
	callToActionBackColor: {
		type: "string",
		default: "#e11b4c",
	},
	callToActionBorderColor: {
		type: "string",
		default: "#ffffff",
	},
	callToActionForeColor: {
		type: "string",
		default: "#ffffff",
	},
	inactiveStarColor: {
		type: "string",
		default: "#888888",
	},
	activeStarColor: {
		type: "string",
		default: "",
	},
	activePercentBarColor: {
		type: "string",
		default: "",
	},
	percentBarColor: {
		type: "string",
		default: "",
	},
	titleAlign: {
		type: "string",
		default: "left",
	},
	authorAlign: {
		type: "string",
		default: "left",
	},
	enableCTA: {
		type: "boolean",
		default: true,
	},
	ctaNoFollow: {
		type: "boolean",
		default: true,
	},
	ctaOpenInNewTab: {
		type: "boolean",
		default: true,
	},
	ctaIsSponsored: {
		type: "boolean",
		default: false,
	},
	ctaAlignment: {
		type: "string",
		default: "left",
	},
	enableReviewSchema: {
		type: "boolean",
		default: true,
	},
	enableImage: {
		type: "boolean",
		default: false,
	},
	enableDescription: {
		type: "boolean",
		default: false,
	},
	starOutlineColor: {
		type: "string",
		default: "",
	},
	imageSize: {
		type: "number",
		default: 100, //range: 0-200
	},
	brand: {
		type: "string",
		default: "",
	},
	sku: {
		type: "string",
		default: "",
	},
	identifier: {
		type: "string",
		default: "",
	},
	identifierType: {
		type: "string",
		default: "gtin", // nsn, mpn, gtin8, gtin12, gtin13, gtin14, gtin
	},
	offerType: {
		type: "string",
		default: "Offer", //can also be set to aggregate offer (which prevevnts calltoactionurl from being  used as offer url)
	},
	offerStatus: {
		type: "string",
		default: "InStock", //available values: Discontinued, InStock, InStoreOnly, LimitedAvailability, OnlineOnly, OutOfStock, PreOrder, PreSale, SoldOut
	},
	//begin aggregate offer-only attributes
	offerHighPrice: {
		type: "number",
		default: 0,
	},
	offerLowPrice: {
		type: "number",
		default: 0,
	},
	offerCount: {
		type: "number",
		default: 0,
	},
	//end aggregate offer-only attributes
	offerPrice: {
		//only for offer
		type: "number",
		default: 0,
	},
	offerCurrency: {
		type: "string",
		default: "USD",
	},
	offerExpiry: {
		type: "number",
		//default: 60 * (10080 + Math.ceil(Date.now() / 60000)),
		default: 0,
	},
	usePhysicalAddress: {
		type: "boolean",
		default: true, //can be set to false when using event itemType
	},
	address: {
		//for localbusiness location, organiztion location, and event location
		type: "string",
		default: "",
	},
	addressName: {
		//for event location
		type: "string",
		default: "",
	},
	url: {
		//for event and organization virtual location
		type: "string",
		default: "",
	},
	reviewPublisher: {
		type: "string",
		default: "",
	},
	reviewPublicationDate: {
		type: "number",
		default: Math.ceil(Date.now() / 1000),
	},
	//beginning of book-only attributes
	bookAuthorName: {
		type: "string",
		default: "",
	},
	isbn: {
		type: "string",
		default: "",
	},

	//end of book-only attributes
	cuisines: {
		//for restaurant
		type: "array",
		default: [], //should be an array of strings
	},
	phoneNumber: {
		type: "string",
		default: "",
	},
	priceRange: {
		type: "string",
		default: "",
	},
	appCategory: {
		//softwareapplication only
		type: "string",
		default: "",
	},
	operatingSystem: {
		//softwareapplication only
		type: "string",
		default: "",
	},
	provider: {
		//for course
		type: "string",
		default: "",
	},
	//beginning of event-only attributes
	eventStartDate: {
		type: "number",
		default: 60 * (1440 + Math.ceil(Date.now() / 60000)), // 24 hours from Date.now
	},
	eventEndDate: {
		type: "number",
		default: 0, //toggling an option should set this to 48 hours from Date.now
	},
	eventPage: {
		type: "string",
		default: "",
	},
	organizer: {
		type: "string",
		default: "",
	},
	performer: {
		type: "string",
		default: "",
	},
	//end event only attributes
	//begin video object attributes
	videoUploadDate: {
		type: "number",
		default: Math.ceil(Date.now() / 1000),
	},
	videoURL: {
		type: "string",
		default: "",
	},
};

function ReviewMain(props) {
	const [editable, setEditable] = useState("");
	const [editedStar, setEditedStar] = useState(0);
	const [lastCuisine, setLastCuisine] = useState("");
	const [setEventEndDate, toggleSetEventEndDate] = useState(false);
	const [offerPriceRaw, setOfferPriceRaw] = useState("0");
	const [offerHighPriceRaw, setOfferHighPriceRaw] = useState("0");
	const [offerLowPriceRaw, setOfferLowPriceRaw] = useState("0");
	const [isLoaded, setIsLoaded] = useState(false);
	const [setCTAFontSize, toggleSetCTAFontSize] = useState(false);

	const {
		attributes: {
			blockID,
			authorName,
			itemName,
			itemPage,
			itemType,
			itemSubtype,
			itemSubsubtype,
			description,
			imgPosition,
			imgID,
			imgAlt,
			imgURL,
			valueType,
			items,
			parts,
			starCount,
			useSummary,
			summaryTitle,
			summaryDescription,
			callToActionText,
			callToActionFontSize,
			callToActionURL,
			callToActionBackColor,
			callToActionBorderColor,
			callToActionForeColor,
			inactiveStarColor,
			activeStarColor,
			starOutlineColor,
			activePercentBarColor,
			percentBarColor,
			titleAlign,
			authorAlign,
			descriptionAlign,
			enableCTA,
			ctaNoFollow,
			ctaOpenInNewTab,
			ctaIsSponsored,
			ctaAlignment,
			enableReviewSchema,
			enableImage,
			enableDescription,
			imageSize,
			brand,
			sku,
			identifier,
			identifierType,
			offerType,
			offerCurrency,
			offerStatus,
			offerCount,
			offerExpiry,
			cuisines,
			appCategory,
			operatingSystem,
			provider,
			isbn,
			bookAuthorName,
			reviewPublisher,
			reviewPublicationDate,
			address,
			addressName,
			priceRange,
			phoneNumber,
			eventStartDate,
			eventEndDate,
			usePhysicalAddress,
			eventPage,
			organizer,
			performer,
			videoUploadDate,
			videoURL,
			padding,
			margin,
			summaryTitleFontSize,
			mainTitleFontSize,
		},
		setAttributes,
		isSelected,
		block,
		getBlock,
		getClientIdsWithDescendants,
	} = props;

	const blockProps = useBlockProps();
	const setAlignment = (target, value) => {
		switch (target) {
			case "reviewTitle":
				setAttributes({ titleAlign: value });
				break;
			case "reviewAuthor":
				setAttributes({ authorAlign: value });
				break;
			case "reviewItemDescription":
				setAttributes({ descriptionAlign: value });
				break;
		}
	};

	const getCurrentAlignment = (target) => {
		switch (target) {
			case "reviewTitle":
				return titleAlign;
			case "reviewAuthor":
				return authorAlign;
			case "reviewItemDescription":
				return descriptionAlign;
		}
	};
	useEffect(() => {
		setAttributes({ blockID: block.clientId });
	}, [block.clientId]);

	useEffect(() => {
		const initialAttributes = {};

		if (blockID === "") {
			Object.assign(initialAttributes, {
				blockID: block.clientId,
				starOutlineColor: "#f7b708",
				activeStarColor: "#f7b708",
			});
		} else {
			if (starOutlineColor === "") {
				Object.assign(initialAttributes, {
					starOutlineColor: "#000000",
				});
			}
			if (activeStarColor === "") {
				Object.assign(initialAttributes, {
					activeStarColor: "#eeee00",
				});
			}
		}

		setAttributes(initialAttributes);

		if (
			items &&
			items !== JSON.stringify(parts) &&
			parts.length === 1 &&
			parts[0].label === "" &&
			parts[0].value === 0
		) {
			setAttributes({
				parts: JSON.parse(items),
				items: '[{"label":"","value":0}]',
			});
		}

		if (!isLoaded) {
			setIsLoaded(true);
			toggleSetCTAFontSize(callToActionFontSize > 0);
		}
	}, []);

	//begin dropdown setup
	let itemTypeExtras;

	const subtypeCategories = {
		Book: ["Audiobook"],
		Event: [
			"BusinessEvent",
			"ChildrensEvent",
			"ComedyEvent",
			"CourseInstance",
			"DanceEvent",
			"DeliveryEvent",
			"EducationEvent",
			"EventSeries", //pending
			"Festival",
			"FoodEvent",
			"Hackathon", //pending
			"LiteraryEvent",
			"MusicEvent",
			"PublicationEvent",
			"SaleEvent",
			"ScreeningEvent",
			"SocialEvent",
			"SportsEvent",
			"TheaterEvent",
			"VisualArtsEvent",
		],
		Game: ["VideoGame"],
		LocalBusiness: [
			"AnimalShelter",
			"ArchiveOrganization", //pending
			"AutomotiveBusiness",
			"ChildCare",
			"Dentist",
			"DryCleaningOrLaundry",
			"EmergencyService",
			"EmploymentAgency",
			"EntertainmentBusiness",
			"FinancialService",
			"FoodEstablishment",
			"GovernmentOffice",
			"HealthAndBeautyBusiness",
			"HomeAndConstructionBusiness",
			"InternetCafe",
			"LegalService",
			"Library",
			"LodgingBusiness",
			"MedicalBusiness",
			"ProfessionalService",
			"RadioStation",
			"RealEstateAgent",
			"RecyclingCenter",
			"SelfStorage",
			"ShoppingCenter",
			"SportsActivityLocation",
			"TelevisionStation",
			"TouristInformationCenter",
			"TravelAgency",
		],
		MediaObject: [
			"3DModel", //pending
			"AudioObject",
			"DataDownload",
			"ImageObject",
			"LegislationObject", //pending
			"MusicVideoObject",
			"VideoObject",
		],
		MusicPlaylist: ["MusicAlbum", "MusicRelease"],
		Organization: [
			"Airline",
			"Consortium", //pending
			"Corporation",
			"EducationalOrganization",
			"FundingScheme", //pending
			"GovernmentOrganization",
			"LibrarySystem", //pending
			"MedicalOrganization",
			"NewsMediaOrganization", //pending
			"NGO",
			"PerformingGroup",
			"Project", //pending
			"SportsOrganization",
			"WorkersUnion",
		],
		Product: [
			"IndividualProduct",
			"ProductCollection",
			"ProductGroup",
			"ProductModel",
			"SomeProducts",
			"Vehicle",
		],
		SoftwareApplication: ["MobileApplication", "VideoGame", "WebApplication"],
	};

	const subsubtypes = {
		PublicationEvent: ["BroadcastEvent", "OnDemandEvent"],
		EducationalOrganization: [
			"CollegeOrUniversity",
			"ElementarySchool",
			"HighSchool",
			"MiddleSchool",
			"Preschool",
			"School",
		],
		MedicalOrganization: [
			"Dentist",
			"DiagnosticLab",
			"Hospital",
			"MedicalClinic",
			"Pharmacy",
			"Physician",
			"VeterinaryCare",
		],
		PerformingGroup: ["DanceGroup", "MusicGroup", "TheaterGroup"],
		Project: ["FundingAgency", "ResearchProject"],
		SportsOrganization: ["SportsTeam"],
		AutomotiveBusiness: [
			"AutoBodyShop",
			"AutoDealer",
			"AutoPartsStore",
			"AutoRental",
			"AutoRepair",
			"AutoWash",
			"GasStation",
			"MotorcycleDealer",
			"MotorcycleRepair",
		],
		EmergencyService: ["FireStation", "Hospital", "PoliceStation"],
		EntertainmentBusiness: [
			"AdultEntertainment",
			"AmusementPark",
			"ArtGallery",
			"Casino",
			"ComedyClub",
			"MovieTheater",
			"NightClub",
		],
		FinancialService: [
			"AccountingService",
			"AutomatedTeller",
			"BankOrCreditUnion",
			"InsuranceAgency",
		],
		FoodEstablishment: [
			"Bakery",
			"BarOrPub",
			"Brewery",
			"CafeOrCoffeeShop",
			"Distillery",
			"FastFoodRestaurant",
			"IceCreamShop",
			"Restaurant",
			"Winery",
		],
		GovernmentOffice: ["PostOffice"],
		HealthAndBeautyBusiness: [
			"BeautySalon",
			"DaySpa",
			"HairSalon",
			"HealthClub",
			"NailSalon",
			"TattooParlor",
		],
		HomeAndConstructionBusiness: [
			"Electrician",
			"GeneralContractor",
			"HVACBusiness",
			"HousePainter",
			"Locksmith",
			"MovingCompany",
			"Plumber",
			"RoofingContractor",
		],
		LegalService: ["Attorney", "Notary"],
		LodgingBusiness: [
			"BedAndBreakfast",
			"Campground",
			"Hostel",
			"Hotel",
			"Motel",
			"Resort",
		],
		MedicalBusiness: [
			//only subtypes that support reviews are included
			"Dentist",
			"MedicalClinic",
			"Optician",
			"Pharmacy",
			"Physician",
		],
		SportsActivityLocation: [
			"BowlingAlley",
			"ExerciseGym",
			"GolfCourse",
			"HealthClub",
			"PublicSwimmingPool",
			"SkiResort",
			"SportsClub",
			"StadiumOrArena",
			"TennisComplex",
		],
		Store: [
			"AutoPartsStore",
			"BikeStore",
			"BookStore",
			"ClothingStore",
			"ComputerStore",
			"ConvenienceStore",
			"DepartmentStore",
			"ElectronicsStore",
			"Florist",
			"FurnitureStore",
			"GardenStore",
			"GroceryStore",
			"HardwareStore",
			"HobbyShop",
			"HomeGoodsStore",
			"JewelryStore",
			"LiquorStore",
			"MensClothingStore",
			"MobilePhoneStore",
			"MovieRentalStore",
			"MusicStore",
			"OfficeEquipmentStore",
			"OutletStore",
			"PawnShop",
			"PetStore",
			"ShoeStore",
			"SportingGoodsStore",
			"TireShop",
			"ToyStore",
			"WholesaleStore",
		],
	};

	const addressInput = (
		<TextControl
			label={__("Address")}
			value={address}
			onChange={(address) => setAttributes({ address })}
		/>
	);
	const cuisineInput = (
		<>
			<p>{__("Serves cuisine")}</p>
			<ul className="ub_review_cuisine_list">
				{Array.isArray(cuisines) && cuisines.length > 0 ? (
					cuisines.map((c, i) => (
						<li>
							{c}
							<span
								className="dashicons dashicons-dismiss"
								onClick={() => {
									setAttributes({
										cuisines: [
											...cuisines.slice(0, i),
											...cuisines.slice(i + 1),
										],
									});
								}}
							/>
						</li>
					))
				) : (
					<span>{__("Cuisine list empty")}</span>
				)}
			</ul>
			<label>{__("Add a cuisine to the list")}</label>
			<input
				type="text"
				value={lastCuisine}
				onKeyUp={(e) => {
					if (e.key === "Enter" && e.target.value !== "") {
						setAttributes({
							cuisines: [...cuisines, e.target.value],
						});
						setLastCuisine("");
					}
				}}
				onChange={(e) => {
					if (e.target.value.includes(",")) {
						const latestItemArray = e.target.value.split(",");

						if (latestItemArray[0] !== "") {
							setAttributes({
								cuisines: [
									...(cuisines.length > 1 || cuisines[0] !== ""
										? cuisines
										: []),
									...latestItemArray.slice(0, latestItemArray.length - 1),
								],
							});
							setLastCuisine(latestItemArray[latestItemArray.length - 1]);
						}
					} else {
						setLastCuisine(e.target.value);
					}
				}}
				onBlur={() => {
					if (lastCuisine !== "") {
						setAttributes({
							cuisines: [
								...(cuisines.length > 1 || cuisines[0] !== "" ? cuisines : []),
								lastCuisine,
							],
						});
						setLastCuisine("");
					}
				}}
			/>
		</>
	);

	const itemURLInput = (
		<div id="ub_review_item_page_input">
			<URLInput
				label={__(`${itemType} Page`)}
				autoFocus={false}
				value={itemPage}
				onChange={(itemPage) => setAttributes({ itemPage })}
			/>
		</div>
	);

	const offerAttributes = [
		"offerType",
		"offerStatus",
		"offerHighPrice",
		"offerLowPrice",
		"offerCount",
		"offerPrice",
		"offerCurrency",
		"offerExpiry",
	];
	let unusedDefaults = [
		"bookAuthorName",
		"isbn",
		"provider",
		...offerAttributes,
		"startDate",
		"endDate",
		"usePhysicalAddress",
		"addressName",
		"address",
		"eventPage",
		"itemPage",
		"organizer",
		"performer",
		"brand",
		"sku",
		"identifierType",
		"identifier",
		"cuisines",
		"phoneNumber",
		"priceRange",
		"appCategory",
		"operatingSystem",
		"videoUploadDate",
		"videoURL",
	];

	switch (itemType) {
		default:
			//there's nothing to add
			break;
		case "Book":
			itemTypeExtras = (
				<>
					<TextControl
						label={__("ISBN")}
						value={isbn}
						onChange={(isbn) => setAttributes({ isbn })}
					/>
					<TextControl
						label={__("Book author name")}
						value={bookAuthorName}
						onChange={(bookAuthorName) => setAttributes({ bookAuthorName })}
					/>
					{itemURLInput}
				</>
			);
			unusedDefaults = removeFromArray(unusedDefaults, [
				"isbn",
				"bookAuthorName",
				"itemPage",
			]);
			break;
		case "Course":
			itemTypeExtras = (
				<TextControl
					label={__("Provider")}
					value={provider}
					onChange={(provider) => setAttributes({ provider })}
				/>
			);
			unusedDefaults = removeFromArray(unusedDefaults, "provider");
			break;
		case "Event":
			itemTypeExtras = (
				<>
					<h3>{__("Event start date")}</h3>
					<DatePicker
						currentDate={eventStartDate * 1000}
						onChange={(newDate) => {
							const newDateVal = Math.floor(Date.parse(newDate) / 1000);
							setAttributes({ eventStartDate: newDateVal });
							if (setEventEndDate && eventEndDate <= newDateVal) {
								setAttributes({
									eventEndDate: 86400 + newDateVal,
								});
							}
						}}
					/>
					<label htmlFor="ub-review-event-date-toggle">
						{__("Use event end date")}
					</label>
					<FormToggle
						id="ub-review-event-date-toggle"
						label={__("Set event end date")}
						checked={setEventEndDate}
						onChange={() => {
							toggleSetEventEndDate(!setEventEndDate);
							setAttributes({
								eventEndDate: setEventEndDate ? 0 : 86400 + eventStartDate,
							});
						}}
					/>
					{setEventEndDate && [
						<h3>{__("Event end date")}</h3>,
						<DatePicker
							currentDate={eventEndDate * 1000}
							onChange={(newDate) =>
								setAttributes({
									eventEndDate: Math.floor(Date.parse(newDate) / 1000),
								})
							}
						/>,
					]}
					<PanelBody title={__("Event venue")} initialOpen>
						<Button
							icon="admin-home"
							isPrimary={usePhysicalAddress}
							onClick={() => setAttributes({ usePhysicalAddress: true })}
							showTooltip={true}
							label={"Use physical location"}
						/>
						<Button
							icon="admin-site-alt3"
							isPrimary={!usePhysicalAddress}
							onClick={() => setAttributes({ usePhysicalAddress: false })}
							showTooltip={true}
							label={"Use virtual location"}
						/>
						{usePhysicalAddress ? (
							<>
								<TextControl
									label={__("Address Name")}
									value={addressName}
									onChange={(addressName) => setAttributes({ addressName })}
								/>
								{addressInput}
							</>
						) : (
							<div id="ub_review_event_page_input">
								<URLInput
									label={__("Event Page")}
									autoFocus={false}
									value={eventPage}
									onChange={(eventPage) => setAttributes({ eventPage })}
								/>
							</div>
						)}
					</PanelBody>
					<TextControl
						label={__("Performer")}
						value={performer}
						onChange={(performer) => setAttributes({ performer })}
					/>
					<TextControl
						label={__("Organizer")}
						value={organizer}
						onChange={(organizer) => setAttributes({ organizer })}
					/>
				</>
			);
			unusedDefaults = removeFromArray(unusedDefaults, [
				...offerAttributes,
				"startDate",
				"endDate",
				"usePhysicalAddress",
				"addressName",
				"address",
				"eventPage",
				"organizer",
				"performer",
			]);
			break;
		case "Product":
			itemTypeExtras = (
				<>
					<TextControl
						label={__("Brand")}
						value={brand}
						onChange={(brand) => setAttributes({ brand })}
					/>
					<TextControl
						label={__("SKU")}
						value={sku}
						onChange={(sku) => setAttributes({ sku })}
					/>
					<TextControl
						label={__("Identifier")}
						value={identifier}
						onChange={(identifier) => setAttributes({ identifier })}
					/>
					<SelectControl
						label={__("Identifier type")}
						value={identifierType}
						options={[
							"nsn",
							"mpn",
							"gtin8",
							"gtin12",
							"gtin13",
							"gtin14",
							"gtin",
						].map((a) => ({
							label: __(a.toUpperCase()),
							value: a,
						}))}
						onChange={(identifierType) => setAttributes({ identifierType })}
					/>
				</>
			);
			unusedDefaults = removeFromArray(unusedDefaults, [
				"brand",
				"sku",
				"identifiertype",
				"identifier",
				...offerAttributes,
			]);

			break;
		case "LocalBusiness":
			itemTypeExtras = (
				<>
					{itemSubtype === "FoodEstablishment" &&
						itemSubsubtype !== "Distillery" &&
						cuisineInput}
					{!(
						["AnimalShelter", "ArchiveOrganization"].includes(itemSubtype) ||
						["FireStation", "PoliceStation"].includes(itemSubsubtype)
					) && (
						<TextControl
							label={__("Price Range")}
							value={priceRange}
							onChange={(priceRange) => setAttributes({ priceRange })}
						/>
					)}
					{addressInput}
					<TextControl
						label={__("Telephone Number")}
						type="tel"
						value={phoneNumber}
						onChange={(phoneNumber) => setAttributes({ phoneNumber })}
					/>
					{itemURLInput}
				</>
			);
			if (
				itemSubtype === "FoodEstablishment" &&
				itemSubsubtype !== "Distillery"
			) {
				unusedDefaults = removeFromArray(unusedDefaults, "cuisines");
			}
			unusedDefaults = removeFromArray(unusedDefaults, [
				"address",
				"itemPage",
				"phoneNumber",
				"priceRange",
			]);
			break;
		case "Movie":
			itemTypeExtras = itemURLInput;
			unusedDefaults = removeFromArray(unusedDefaults, ["itemPage"]);
			break;
		case "Organization":
			itemTypeExtras = (
				<>
					{(itemSubsubtype === "Hospital" ||
						subsubtypes.MedicalBusiness.includes(itemSubsubtype)) && (
						<TextControl
							label={__("Price Range")}
							value={priceRange}
							onChange={(priceRange) => setAttributes({ priceRange })}
						/>
					)}
					{addressInput}
					<TextControl
						label={__("Telephone Number")}
						type="tel"
						value={phoneNumber}
						onChange={(phoneNumber) => setAttributes({ phoneNumber })}
					/>
				</>
			);
			unusedDefaults = removeFromArray(unusedDefaults, [
				"address",
				"phoneNumber",
				"priceRange",
			]);
			break;
		case "SoftwareApplication":
			itemTypeExtras = (
				<>
					<TextControl
						label={__("Application Category")}
						value={appCategory}
						onChange={(appCategory) => setAttributes({ appCategory })}
					/>
					<TextControl
						label={__("Operating System")}
						value={operatingSystem}
						onChange={(operatingSystem) => setAttributes({ operatingSystem })}
					/>
				</>
			);
			unusedDefaults = removeFromArray(unusedDefaults, [
				...offerAttributes,
				"appCategory",
				"operatingSystem",
			]);
			break;
		case "MediaObject":
			if (itemSubtype === "VideoObject") {
				itemTypeExtras = (
					<>
						<h3>{__("Video upload date")}</h3>,
						<DatePicker
							currentDate={videoUploadDate * 1000}
							onChange={(newDate) =>
								setAttributes({
									videoUploadDate: Math.floor(Date.parse(newDate) / 1000),
								})
							}
						/>
						<div id="ub_review_video_url_input">
							<URLInput
								label={__("Video URL")}
								autoFocus={false}
								value={videoURL}
								onChange={(videoURL) => setAttributes({ videoURL })}
							/>
						</div>
					</>
				);
				unusedDefaults = removeFromArray(unusedDefaults, [
					"videoUploadDate",
					"videoURL",
				]);
			}
			break;
	}

	const schemaDefaults = Object.keys(
		Object.assign({}, defaultAttributes),
	).reduce((defaults, attr) => {
		if (unusedDefaults.includes(attr)) {
			defaults[attr] = defaultAttributes[attr].default;
		}
		return defaults;
	}, {});

	const unusedAttributes = Object.keys(props.attributes).reduce(
		(defaults, attr) => {
			if (
				unusedDefaults.includes(attr) &&
				props.attributes[attr] !== schemaDefaults[attr]
			) {
				defaults[attr] = defaultAttributes[attr].default;
			}
			return defaults;
		},
		{},
	);

	if (Object.keys(unusedAttributes).length) {
		setAttributes(unusedAttributes);
	}

	const parser = new DOMParser();

	return (
		<div {...blockProps}>
			{isSelected && (
				<>
					<InspectorControls group="settings">
						<PanelBody title={__("Rating Format")}>
							<RadioControl
								selected={valueType}
								options={["star", "percent"].map((a) => ({
									label: __(a),
									value: a,
								}))}
								onChange={(newValueType) => {
									const factor = 100 / starCount;
									setAttributes({
										valueType: newValueType,
										parts: parts.map((p) => ({
											label: p.label,
											value:
												valueType === "star"
													? p.value * factor
													: p.value / factor,
										})),
										activePercentBarColor:
											valueType === "star" && !activePercentBarColor
												? "#e11b4c"
												: activePercentBarColor,
									});
								}}
							/>
						</PanelBody>

						<PanelBody title={__("Set Value")} initialOpen={false}>
							{editedStar > -1 && (
								<RangeControl
									label={__(
										`Value for ${
											parser.parseFromString(
												parts[editedStar].label,
												"text/html",
											).body.textContent || "current feature"
										}`,
									)}
									value={parts[editedStar].value}
									onChange={(newValue) => {
										setAttributes({
											parts: [
												...parts.slice(0, editedStar),
												Object.assign({}, parts[editedStar], {
													value: newValue,
												}),
												...parts.slice(editedStar + 1),
											],
										});
									}}
									min={valueType === "star" ? 0 : 1}
									max={valueType === "star" ? starCount : 100}
									step={valueType === "star" ? 0.1 : 1}
								/>
							)}
							<p>
								{__(
									"This lets you set the value for whichever feature list item you are currently editing.",
								)}
							</p>
						</PanelBody>

						<PanelBody title={__("CTA Button")} initialOpen={false}>
							<PanelRow>
								<label htmlFor="ub-review-cta-enable">{__("Enable")}</label>
								<FormToggle
									id="ub-review-cta-enable"
									label={__("Enable")}
									checked={enableCTA}
									onChange={() =>
										setAttributes({
											enableCTA: !enableCTA,
										})
									}
								/>
							</PanelRow>
							{enableCTA && (
								<>
									<PanelRow>
										<label>{__("Alignment")}</label>
										<ButtonGroup>
											{["left", "center", "right"].map((a) => (
												<Button
													icon={`align-${a}`}
													isPrimary={ctaAlignment === a}
													onClick={() =>
														setAttributes({
															ctaAlignment: a,
														})
													}
												/>
											))}
										</ButtonGroup>
									</PanelRow>
								</>
							)}
						</PanelBody>
						<PanelBody title={__("Review Schema")} initialOpen={false}>
							<PanelRow>
								<label htmlFor="ub-review-schema-toggle">
									{__("Enable review schema")}
								</label>
								<FormToggle
									id="ub-review-schema-toggle"
									label={__("Enable review schema")}
									checked={enableReviewSchema}
									onChange={() => {
										let newAttributes = {
											enableReviewSchema: !enableReviewSchema,
										};
										if (enableReviewSchema) {
											newAttributes = Object.assign(newAttributes, {
												enableImage: false,
												enableDescription: false,
											});
										}
										setAttributes(newAttributes);
									}}
								/>
							</PanelRow>
							<PanelRow>
								<label htmlFor="ub-review-summary-toggle">
									{__("Use review summary")}
								</label>
								<FormToggle
									id="ub-review-summary-toggle"
									label={__("Use review summary")}
									checked={useSummary}
									onChange={() =>
										setAttributes({
											useSummary: !useSummary,
										})
									}
								/>
							</PanelRow>
							{enableReviewSchema && (
								<>
									<SelectControl
										label={__("Item type")}
										value={itemType}
										onChange={(itemType) => {
											setAttributes({ itemType });
											if (itemType === "Movie") {
												setAttributes({
													enableImage: true,
												});
											}
											if (itemType === "Course") {
												setAttributes({
													enableDescription: true,
												});
											}
											if (
												!subtypeCategories.hasOwnProperty(itemType) ||
												!subtypeCategories[itemType].includes(itemSubtype)
											) {
												setAttributes({
													itemSubtype: "",
													itemSubsubtype: "",
												});
											}
										}}
										options={[
											"Book",
											"Course",
											"CreativeWorkSeason",
											"CreativeWorkSeries",
											"Episode",
											"Event",
											"Game",
											"LocalBusiness",
											"MediaObject",
											"Movie",
											"MusicPlaylist",
											"MusicRecording",
											"Organization",
											"Product",
											"SoftwareApplication",
										].map((a) => ({
											label: a,
											value: a,
										}))}
									/>
									{subtypeCategories.hasOwnProperty(itemType) && (
										<SelectControl
											label={__("Item subtype")}
											value={itemSubtype}
											onChange={(itemSubtype) => {
												setAttributes({
													itemSubtype,
												});
												if (itemSubtype === "VideoObject") {
													setAttributes({
														enableImage: true,
													});
												}
												if (
													!subsubtypes.hasOwnProperty(itemSubtype) ||
													!subsubtypes[itemSubtype].includes(itemSubsubtype)
												) {
													setAttributes({
														itemSubsubtype: "",
													});
												}
											}}
											options={["", ...subtypeCategories[itemType]].map(
												(a) => ({
													label: a,
													value: a,
												}),
											)}
										/>
									)}
									{subsubtypes.hasOwnProperty(itemSubtype) && (
										<SelectControl
											label={__("Item subsubtype")}
											value={itemSubsubtype}
											onChange={(itemSubsubtype) =>
												setAttributes({
													itemSubsubtype,
												})
											}
											options={["", ...subsubtypes[itemSubtype]].map((a) => ({
												label: a,
												value: a,
											}))}
										/>
									)}
								</>
							)}
							<>
								{!(
									enableReviewSchema &&
									(itemType === "Movie" || itemSubtype === "VideoObject")
								) && (
									//images are required for these item types and optional for the rest
									<PanelRow>
										<label htmlFor="ub-review-image-toggle">
											{__("Enable review image")}
										</label>
										<FormToggle
											id="ub-review-image-toggle"
											label={__("Enable review image")}
											checked={enableImage}
											onChange={() =>
												setAttributes({
													enableImage: !enableImage,
												})
											}
										/>
									</PanelRow>
								)}
								{enableImage && (
									<>
										<PanelRow>
											<label>{__("Image size")}</label>
											<input
												type="number"
												value={imageSize}
												onChange={(e) =>
													setAttributes({
														imageSize: Number(e.target.value),
													})
												}
											/>
										</PanelRow>
										<PanelRow>
											<label>{__("Image position")}</label>
											<SelectControl
												value={imgPosition}
												onChange={(imgPosition) =>
													setAttributes({
														imgPosition,
													})
												}
												options={[
													"left",
													"right",
													...(enableDescription ? ["top", "bottom"] : []),
												].map((a) => ({
													label: __(a),
													value: a,
												}))}
											/>
										</PanelRow>
									</>
								)}
								{(!enableReviewSchema || itemType !== "Course") && (
									<PanelRow>
										<label htmlFor="ub-review-description-toggle">
											{__("Enable review description")}
										</label>
										<FormToggle
											id="ub-review-description-toggle"
											label={__("Enable review description")}
											checked={enableDescription}
											onChange={() => {
												setAttributes({
													enableDescription: !enableDescription,
												});
												if (
													!enableDescription &&
													["top", "bottom"].includes(imgPosition)
												) {
													setAttributes({
														imgPosition: "right",
													});
												}
											}}
										/>
									</PanelRow>
								)}
							</>
							{enableReviewSchema && (
								<>
									{itemTypeExtras}
									<TextControl
										label={__("Review publisher")}
										value={reviewPublisher}
										onChange={(reviewPublisher) =>
											setAttributes({ reviewPublisher })
										}
									/>
									<p>{__("Review publication date")}</p>
									<DatePicker
										currentDate={reviewPublicationDate * 1000}
										onChange={(newDate) =>
											setAttributes({
												reviewPublicationDate: Math.floor(
													Date.parse(newDate) / 1000,
												),
											})
										}
									/>
									{["Event", "Product", "SoftwareApplication"].includes(
										itemType,
									) && (
										<PanelBody title={__("Offer")}>
											<SelectControl
												label={__("Offer Type")}
												value={offerType}
												options={["Offer", "Aggregate Offer"].map((a) => ({
													label: __(a),
													value: a.replace(" ", ""),
												}))}
												onChange={(offerType) =>
													setAttributes({
														offerType,
													})
												}
											/>
											<TextControl
												label={__("Offer Currency")}
												value={offerCurrency}
												onChange={(offerCurrency) =>
													setAttributes({
														offerCurrency,
													})
												}
											/>
											{offerType === "Offer" ? (
												<>
													<TextControl
														label={__("Offer Price")}
														value={offerPriceRaw}
														onChange={(val) => {
															if (!isNaN(Number(val))) {
																setAttributes({
																	offerPrice: Number(val),
																});
																setOfferPriceRaw(val);
															}
														}}
													/>
													<SelectControl
														label={__("Offer Status")}
														value={offerStatus}
														options={[
															"Discontinued",
															"In Stock",
															"In Store Only",
															"Limited Availability",
															"Online Only",
															"Out Of Stock",
															"Pre Order",
															"Pre Sale",
															"Sold Out",
														].map((a) => ({
															label: __(a),
															value: a.replace(" ", ""),
														}))}
														onChange={(offerStatus) =>
															setAttributes({
																offerStatus,
															})
														}
													/>
													<ToggleControl
														label={__("Offer expiration")}
														checked={offerExpiry > 0}
														onChange={() =>
															setAttributes({
																offerExpiry: offerExpiry
																	? 0
																	: 60 *
																		(10080 + Math.ceil(Date.now() / 60000)), //default to one week from Date.now() when enabled
															})
														}
													/>
													{offerExpiry > 0 && (
														<DatePicker
															currentDate={offerExpiry * 1000}
															onChange={(newDate) =>
																setAttributes({
																	offerExpiry: Math.floor(
																		Date.parse(newDate) / 1000,
																	),
																})
															}
														/>
													)}
												</>
											) : (
												<>
													<TextControl
														label={__("Offer Count")}
														value={offerCount}
														onChange={(val) =>
															setAttributes({
																offerCount: Number(val),
															})
														}
													/>
													<TextControl
														label={__(
															`Lowest Available Price (${offerCurrency})`,
														)}
														value={offerLowPriceRaw}
														onChange={(val) => {
															if (!isNaN(val)) {
																setOfferLowPriceRaw(val);
																setAttributes({
																	offerLowPrice: Number(val),
																});
															}
														}}
													/>
													<TextControl
														label={__(
															`Highest Available Price (${offerCurrency})`,
														)}
														value={offerHighPriceRaw}
														onChange={(val) => {
															if (!isNaN(val)) {
																setOfferHighPriceRaw(val);
																setAttributes({
																	offerHighPrice: Number(val),
																});
															}
														}}
													/>
												</>
											)}
										</PanelBody>
									)}
								</>
							)}
						</PanelBody>
					</InspectorControls>
					<InspectorControls group="styles">
						<PanelBody title={__("Colors")}>
							{valueType === "star" ? (
								<PanelColorSettings
									title={__("Star Colors")}
									initialOpen={true}
									colorSettings={[
										{
											value: activeStarColor,
											onChange: (colorValue) =>
												setAttributes({
													activeStarColor: colorValue,
												}),
											label: __("Active Star Color"),
										},
										{
											value: inactiveStarColor,
											onChange: (colorValue) =>
												setAttributes({
													inactiveStarColor: colorValue,
												}),
											label: __("Inactive Star Color"),
										},
										{
											value: starOutlineColor,
											onChange: (colorValue) =>
												setAttributes({
													starOutlineColor: colorValue,
												}),
											label: __("Star Outline Color"),
										},
									]}
								/>
							) : (
								<PanelColorSettings
									title={__("Percentage Bar Colors")}
									colorSettings={[
										{
											value: activePercentBarColor,
											onChange: (colorValue) =>
												setAttributes({
													activePercentBarColor: colorValue,
												}),
											label: __("Main Color"),
										},
										{
											value: percentBarColor,
											onChange: (colorValue) =>
												setAttributes({
													percentBarColor: colorValue,
												}),
											label: __("Background Color"),
										},
									]}
								/>
							)}
						</PanelBody>
						<PanelBody
							title={__("Dimension Settings", "ultimate-blocks")}
							initialOpen={false}
						>
							<SpacingControl
								showByDefault
								attrKey="padding"
								label={__("Padding", "ultimate-blocks")}
							/>
							<SpacingControl
								minimumCustomValue={-Infinity}
								showByDefault
								attrKey="margin"
								label={__("Margin", "ultimate-blocks")}
							/>
						</PanelBody>
					</InspectorControls>
					<InspectorControls group="typography">
						<CustomFontSizePicker
							attrKey={"summaryTitleFontSize"}
							label={__("Summary Title Font", "ultimate-blocks")}
						/>
						<CustomFontSizePicker
							attrKey={"mainTitleFontSize"}
							label={__("Title Font", "ultimate-blocks")}
						/>
					</InspectorControls>
				</>
			)}
			{isSelected && (
				<BlockControls>
					{editable !== "" && (
						<ToolbarGroup>
							{["left", "center", "right", "justify"].map((a) => (
								<ToolbarButton
									icon={`editor-${a === "justify" ? a : "align" + a}`}
									label={__(
										(a !== "justify" ? "Align " : "") +
											a[0].toUpperCase() +
											a.slice(1),
									)}
									isActive={getCurrentAlignment(editable) === a}
									onClick={() => setAlignment(editable, a)}
								/>
							))}
						</ToolbarGroup>
					)}
				</BlockControls>
			)}
			<ReviewBody
				padding={padding}
				margin={margin}
				isSelected={isSelected}
				authorName={authorName}
				itemName={itemName}
				description={description}
				descriptionEnabled={enableDescription}
				blockID={blockID}
				imgID={imgID}
				imgAlt={imgAlt}
				imgURL={imgURL}
				imgPosition={imgPosition}
				enableImage={enableImage}
				valueType={valueType}
				parts={parts}
				starCount={starCount}
				useSummary={useSummary}
				summaryTitle={summaryTitle}
				summaryDescription={summaryDescription}
				callToActionText={callToActionText}
				callToActionURL={callToActionURL}
				callToActionBackColor={callToActionBackColor}
				callToActionBorderColor={callToActionBorderColor}
				callToActionForeColor={callToActionForeColor}
				ctaAlignment={ctaAlignment}
				inactiveStarColor={inactiveStarColor}
				activeStarColor={activeStarColor}
				activePercentBarColor={activePercentBarColor}
				percentBarColor={percentBarColor}
				selectedStarColor={activeStarColor}
				starOutlineColor={starOutlineColor}
				setAttributes={(newValues) => setAttributes(newValues)}
				setEditable={(val) => setEditable(val)}
				setActiveStarIndex={(val) => setEditedStar(val)}
				activeStarIndex={editedStar}
				alignments={{ titleAlign, authorAlign, descriptionAlign }}
				enableCTA={enableCTA}
				ctaNoFollow={ctaNoFollow}
				imageSize={imageSize}
				ctaFontSize={callToActionFontSize}
				measureCTAFontSize={setCTAFontSize}
				ctaOpenInNewTab={ctaOpenInNewTab}
				ctaIsSponsored={ctaIsSponsored}
				block={block}
				summaryTitleFontSize={summaryTitleFontSize}
				mainTitleFontSize={mainTitleFontSize}
			/>
		</div>
	);
}

registerPluginBlock(metadata.name, {
	...metadata,
	icon,
	example: {},
	attributes: metadata.attributes,
	edit: compose([
		withSelect((select, ownProps) => {
			const { getBlock, getClientIdsWithDescendants } =
				select("core/block-editor") || select("core/editor");

			return {
				block: getBlock(ownProps.clientId),
				getBlock,
				getClientIdsWithDescendants,
			};
		}),
	])(ReviewMain),
	save,
	deprecated: [
		updateFrom(version_1_1_2),
		updateFrom(version_1_1_4),
		updateFrom(version_1_1_5),
	],
});
