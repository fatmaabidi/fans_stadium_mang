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

	return Controller.extend("stadium.stadium.controller.PageAcceuil", {

	
		onClick_intro: function(oEvent){
			this.getOwnerComponent().getRouter().navTo("Introduction");
		},
		
		onClick_forum: function(oEvent){
			this.getOwnerComponent().getRouter().navTo("Forum");
		},
		onClick_dashboard: function(oEvent){
			this.getOwnerComponent().getRouter().navTo("AgentDashboard");
		},

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
		

	});
});