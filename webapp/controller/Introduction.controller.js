sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/m/Popover',
	'sap/m/Button',
	'sap/m/library',
	'jquery.sap.global',
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox",
	"sap/ui/core/syncStyleClass",
	"sap/m/MessageToast",
	"sap/ui/core/IconPool",
	"sap/m/Dialog",
	"sap/m/List",
	"sap/m/StandardListItem",
	"sap/m/Text"
], function (Controller, Popover, Button, library, jQuery, JSONModel, Fragment, MessageBox, syncStyleClass, MessageToast ) {
	"use strict";
	var iTimeoutId;

	var ButtonType = library.ButtonType,
		PlacementType = library.PlacementType;

	return Controller.extend("stadium.stadium.controller.Introduction", {

		// 	onInit: function () {
		// 	var oImgModel = new JSONModel(sap.ui.require.toUrl("sap/ui/demo/mock/img.json"));
		// 	this.getView().setModel(oImgModel, "img");
		// }

		// onInit: function () {
	
		// },
		onClick_intro: function(oEvent){
			this.getOwnerComponent().getRouter().navTo("Introduction");
		},

		// 	this.oModel = new JSONModel();
		// 	this.oModel.loadData(sap.ui.require.toUrl("stadium/stadium/model/avatargroup.json"), null, false);
		// 	this.getView().setModel(this.oModel, "items");

		// 	this.oSettingsModel = new JSONModel();
		// 	this.oSettingsModel.setData({
		// 		"viewPortPercentWidth": 100
		// 	});
		// 	this.getView().setModel(this.oSettingsModel);

		// 	this.oIndividualModel = new JSONModel();
		// 	this.oIndividualModel.loadData(sap.ui.require.toUrl("stadium/stadium/model/avatargroup.json"), null, false);
		// 	this.getView().setModel(this.oIndividualModel, "personData");

		// },
		
			// This method creates dialogs from the fragment name
			_createDialog: function (sDialog) {
				var oDialog = sap.ui.xmlfragment(sDialog, this);
				// switch the dialog to compact mode if the hosting view has compact mode
				jQuery.sap.syncStyleClass('sapUiSizeCompact', this.oView, oDialog);

				this.getView().addDependent(oDialog);
				return oDialog;
			},
			handleEditPress: function (){
			var sForm = this.getView().byId("change");
				
			},
		

			onDefaultDialogPress: function () {
				
			if (!this.oDefaultDialog) {
				this.oDefaultDialog = this._createDialog("stadium.stadium.view.fragment.SettingsDialog");
			
			}

			this.oDefaultDialog.open();
			// var sForm = this.oDefaultDialog.getView().byId("change");
			// sForm.setVisible(false);
			// sForm.removeContent();
			
		},
		
			
		onUserNamePress: function (oEvent) {
			var oPopover = new Popover({
				showHeader: false,
				placement: PlacementType.Bottom,
				content: [
					new Button({
						text: 'Feedback',
						type: ButtonType.Transparent
					}),
					new Button({
						text: 'Help',
						type: ButtonType.Transparent
					}),
					new Button({
						text: 'Logout',
						type: ButtonType.Transparent
					})
				]
			}).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');

			oPopover.openBy(oEvent.getSource());
		},
		onAfterRendering: function () {
			this._oAvatarGroup = this.getView().byId("avatarGroup");
			this._oSlider = this.getView().byId("slider");
		},

		onSliderMoved: function () {
			var iValue = this._oSlider.getModel().getProperty("/viewPortPercentWidth");

			this.byId("vl1").setWidth(iValue + "%");
		},

		onProfilePress: function (oEvent) {

			var oEventSource = oEvent.getSource(),
				oView = this.getView();

			if (!this._userProfile) {

				this._userProfile = Fragment.load({
					id: oView.getId(),
					name: "stadium.stadium.view.fragment.IndividualPopover",
					controller: this
				}).then(function (oIndividuaLPopover) {
					oView.addDependent(oIndividuaLPopover);
					return oIndividuaLPopover;
				});

			}

			this._userProfile.then(function (oIndividuaLPopover) {
				oIndividuaLPopover.openBy(oEventSource).addStyleClass("sapFAvatarGroupPopover");
			}.bind(this));
		},
		// 	simulateServerRequest: function () {

		// 	// simulate a longer running operation
		// 	iTimeoutId = setTimeout(function() {
		// 		new sap.m.MessageToast.show("Hello") ;
		// 		this._pBusyDialog.then(function(oBusyDialog) {
		// 			oBusyDialog.close();
		// 		});
		// 	}.bind(this), 3000);
		// },
		// 	onDialogClosed: function (oEvent) {
		// 	clearTimeout(iTimeoutId);

		// 	if (oEvent.getParameter("cancelPressed")) {
		// 		MessageToast.show("The operation has been cancelled");
		// 	} else {
		// 		MessageToast.show("The operation has been completed");
		// 	}
		// },

		onLogoff: function () {
			MessageBox.confirm("Are you sure you want to sign out?", {
				actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
				onClose: function (sAnswer) {
					if (sAnswer === MessageBox.Action.OK) {
						// load BusyDialog fragment asynchronously
						if (!this._pBusyDialog) {
							this._pBusyDialog = Fragment.load({
								name: "stadium.stadium.view.fragment.BusyDialog",
								controller: this
							}).then(function (oBusyDialog) {
								this.getView().addDependent(oBusyDialog);
								syncStyleClass("sapUiSizeCompact", this.getView(), oBusyDialog);
								return oBusyDialog;
							}.bind(this));
						}

						this._pBusyDialog.then(function (oBusyDialog) {
							oBusyDialog.open();
							this.simulateServerRequest();
						}.bind(this));

					}
				}

			});

		},

		onMenuButtonPress: function () {
			var toolPage = this.byId("toolPage");

			toolPage.setSideExpanded(!toolPage.getSideExpanded());
		},

		// onAvatarPress: function (oEvent) {
		// 	var oBindingInfo = oEvent.getSource().getBindingContext("groupedAvatars").getObject(),
		// 		oNavCon = this.byId("navCon"),
		// 		oDetailPage = this.byId("detail"),
		// 		oGroupPopover = this.byId("groupPopover");

		// 	oGroupPopover.setContentHeight("375px");
		// 	oGroupPopover.setContentWidth("450px");
		// 	this.oIndividualModel.setData(oBindingInfo);
		// 	oNavCon.to(oDetailPage);
		// 	oGroupPopover.focus();
		// },

		_getContent: function (sGroupType, iAvatarsDisplayed) {
			var aAllAvatars = this._oAvatarGroup.getItems(),
				aAvatarsToShowInPopover,
				oBindingInfo;

			aAvatarsToShowInPopover = aAllAvatars.slice(iAvatarsDisplayed);

			return aAvatarsToShowInPopover.map(function (oAvatarGroupItem) {
				oBindingInfo = oAvatarGroupItem.getBindingContext("items").getObject();
				return this._getAvatarModel(oBindingInfo, oAvatarGroupItem);
			}, this);
		},

		_getAvatarModel: function (oBindingInfo, oAvatarGroupItem) {
			return {
				src: oBindingInfo.src,
				initials: oBindingInfo.initials,
				fallbackIcon: oBindingInfo.fallbackIcon,
				backgroundColor: oAvatarGroupItem.getAvatarColor(),
				name: oBindingInfo.name,
				jobPosition: oBindingInfo.jobPosition,
				mobile: oBindingInfo.mobile,
				phone: oBindingInfo.phone,
				email: oBindingInfo.email
			};
		},

		onNavBack: function () {
				var oNavCon = this.byId("navCon");

				this.byId("groupPopover").setContentHeight(this._sGroupPopoverHeight);
				oNavCon.back();
			}
			// 	onCollapseExpandPress: function () {
			// 		new sap.m.MessageToast.show("Hello") ;
			// 	// var oSideNavigation = this.byId('sideNavigation');
			// 	// var bExpanded = oSideNavigation.getExpanded();

		// 	// oSideNavigation.setExpanded(!bExpanded);
		// }

	});
});