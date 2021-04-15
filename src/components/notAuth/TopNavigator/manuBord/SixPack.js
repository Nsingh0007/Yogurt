import React, { Component, Fragment } from "react";
import { View, Text, StyleSheet, TouchableOpacity, } from "react-native";
import nextArrow from "../../../../assets/icon/order/icons8-forward-26.png";
import Vector2 from "../../../../assets/icon/order/Vector2.png";
import { connect } from "react-redux";
import FastImage from "react-native-fast-image";
import BackHoc from './BackHoc';

Text.defaultProps = {
  allowFontScaling: false,
  fontScale: 1,
};
function toCapitalCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
function toTitleCase(Case) {
  let str = Case.replace(/([A-Z]+)*([A-Z][a-z])/g, "$1 $2");
  return toCapitalCase(str);
}

const mapHeadingData = {
  flavours: "FLAVORS",
  bottomFlavor: "menuBottomFlavour",
  middleFlavor: "menuMiddleFlavour",
  topFlavor: "menuTopFlavour",
  toppings: "TOPPINGS",
  bottomTopping: "menuBottomTopping",
  middleTopping: "menuMiddleTopping",
  topTopping: "menuTopTopping",
  sideTopping: "menusidetoppings",
}

const navigateRoute = {
  flavours: "menuFlavour",
  bottomFlavor: "menuBottomFlavour",
  middleFlavor: "menuMiddleFlavour",
  topFlavor: "menuTopFlavour",
  toppings: "menuTopping",
  bottomTopping: "menuBottomTopping",
  middleTopping: "menuMiddleTopping",
  topTopping: "menuTopTopping",
  sideTopping: "menusidetoppings",
};
class SixPack extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount = () => {};

  header = ({ subHeading }) => {
    console.log("SubHeading - ",subHeading);
    return (
      <Fragment>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("menuIndex")}
          >
            <FastImage
              source={Vector2}
              style={{ height: 25, width: 25, margin: 6 }}
            />
          </TouchableOpacity>
          <View style={{ justifyContent: "center" }}>
            <Text style={styles.headerText}>{mapHeadingData[subHeading]}</Text>
          </View>
          <Text style={styles.headerText}> </Text>
        </View>
        <View style={styles.subHeader}>
          <Text style={styles.subHeaderText}>Six Pack</Text>
        </View>
      </Fragment>
    );
  };
  renderNippers = (singleType, index) => {
    const { getParam } = this.props.navigation;
    const navigateParam = navigateRoute[getParam("type")];
    const { sixPackDataIndex } = this.readyRender();
    return (
      <View style={styles.cardView}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate(navigateParam, {
              CategoryId: getParam("CategoryId"),
              SubCategoryId: getParam("SubCategoryId"),
              type: getParam("type"),
              sixPackDataIndex: sixPackDataIndex,
              productIndex: index,
              isSixPackLogic: true,
            });
          }}
        >
          <View style={styles.card}>
            <View style={{justifyContent:'space-between', flexDirection:'row'}}>
              <Text style={styles.subContent}>{singleType.type}</Text>

            <FastImage
              source={nextArrow}
              style={{ width: 15, height: 15, margin: 10, marginEnd: 20 }}
            />
            </View>
            
            {singleType.products.map((singleProduct, index) => {
            const {
              ToppingName = undefined,
              FlavorName = undefined,
            } = singleProduct;
            let text = ToppingName ? ToppingName : FlavorName;

            return <Text style={styles.subTextContent}>{text}</Text>;
          })}
          </View>
          
        </TouchableOpacity>
      </View>
    );
  };
  readyRender = () => {
    const { getParam } = this.props.navigation;
    const {
      sixPackStore: { sixPackData },
    } = this.props;
    let sixPackDataIndex = 0;
    const executeArr = sixPackData.find((singleSixPack, index) => {
      if (
        singleSixPack.Category.CategoryId == getParam("CategoryId") &&
        singleSixPack.SubCategory.SubCategoryId == getParam("SubCategoryId")
      ) {
        sixPackDataIndex = index;
        return true;
      }
    });
    return {
      executeArr,
      type: getParam("type"),
      sixPackDataIndex,
    };
  };
  render() {
    const { executeArr, type } = this.readyRender();
    return (
      <View style={styles.container}>
        <this.header subHeading={type} />
        {executeArr.Products[type].map(this.renderNippers)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  header: {
    backgroundColor: "#2D2926",
    width: "100%",
    height: 60,
    padding: 13,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 20,
    fontFamily: "OpenSans-ExtraBold",
    fontWeight: "700",
    color: "#FFFFFF",
  },
  subHeader: {
    height: 35,
    backgroundColor: "#DBDDDE",
    justifyContent: "center",
  },
  subHeaderText: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: 20,
    marginLeft: 15,
  },
  cardView: {},
  card: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#E6E6E6",
    width: "99%",
    alignSelf: "center",
    marginTop: 10,
  },
  subContent: {
    fontSize: 15,
    fontFamily: "OpenSans-Bold",
    fontWeight: "bold",
    margin: 5,
    marginStart: 20,
    color: "#414040",
  },
  subTextContent: {
    fontSize: 13,
    fontFamily: "OpenSans-SemiBold",
    color: "#793422",
    marginStart: 20,
    marginEnd: 20,
  },
});

const mapStateToProps = (state) => {
  return {
    sixPackStore: state.sixPackStore,
  };
};
export default connect(mapStateToProps, null)(BackHoc(SixPack));
