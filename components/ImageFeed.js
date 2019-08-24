import Amplify from "@aws-amplify/core";
import Storage from "@aws-amplify/storage";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import React from "react";
import {
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import config from "../aws-exports";
import Header from "./Header";
import ImageCard from "./ImageCard";

Amplify.configure(config);

export default class ImageFeed extends React.Component {
  state = {
    isRefreshing: false,
    image: null,
    allImages: []
  };

  // First of all fetch all public images from S3
  componentDidMount = async () => {
    await this.fetchImages("images/", { level: "public" }); // (path, access)
    this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
  };

  // Upload an image to S3
  uploadImageToS3 = async uri => {
    const response = await fetch(uri);
    const blob = await response.blob(); // format the data for images
    const folder = "images";
    // generate a unique random name for every single image 'fixed length'
    const fileName =
      Math.random()
        .toString(18)
        .slice(3)
        .substr(0, 10) + ".jpeg";
    await Storage.put(folder + "/" + fileName, blob, {
      contentType: "image/jpeg",
      level: "public"
    })
      .then(() => {
        // every time a new image is added, we call all the items again
        this.fetchImages("images/", { level: "public" });
      })
      .catch(err => console.log(err));
  };

  fetchImages = async (path, access) => {
    await Storage.list(path, access)
      .then(async res => {
        // Get rid of the first item in the returned array which is the folder itself !!! (blame AWS )
        res = res.slice(1);
        // Clone the original array of data to avoid mutating the original data
        let resModified = [].concat(res);
        // Sort the images by descending publication date
        resModified.sort((a, b) =>
          b["lastModified"].toString().localeCompare(a["lastModified"])
        );
        // Add the uri of every image stored in S3
        await this.getImagesUri(resModified); // (data)
        // Store the up to date data in the allImages array
        this.setState({ allImages: resModified });
        // console.log('allImages: ', this.state.allImages)
      })
      .catch(err => console.log(err));
  };

  /* 
		The uri of the image is surprisingly absent from the object item of the Storage.list() response.
		Only by calling Storage.get() on every item of the list that we will get the uri.
		The below function will call Storage.get() on every single key from the Storage.list() array
		to return the uri of every image stored in allImages.
	*/
  getImagesUri = async data => {
    let count, foo;
    let uriArray = [];
    for (count = 0; count < data.length; count++) {
      foo = data[count]["key"];
      // Given the key, the get method below returns the uri of every image
      await Storage.get(foo)
        .then(bar => {
          // shorten the uri for fast parsing
          bar.substr(0, 102);
          uriArray.push(bar);
        })
        .catch(err => console.log(err));
      // add an uri key to the data array of objects
      data[count]["uri"] = uriArray[count];
    }
  };

  // Ask for permission to access the user's phone library
  askPermissionsAsync = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
  };

  // Fetch a single image from user's device and upload it to S3
  useLibraryHandler = async () => {
    await this.askPermissionsAsync();
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri });
      this.uploadImageToS3(this.state.image);
    }
  };

  // Remove Image from S3
  removeImageFromS3 = async name => {
    await Storage.remove(name)
      .then(result => console.log("Deleted", result))
      .catch(err => console.log(err));
  };

  render() {
    let { allImages } = this.state;
    return (
      <View style={styles.container}>
        <Header
          reload={this.componentDidMount}
          uploadImage={this.useLibraryHandler}
        />
        <ScrollView contentContainerStyle={styles.container}>
          <FlatList
            ref={ref => {
              this.flatListRef = ref;
            }}
            data={allImages}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={() => this.componentDidMount()}
              />
            }
            renderItem={item => {
              return (
                <ImageCard
                  itemKey={item.item.key}
                  date={item.item.lastModified}
                  uri={item.item.uri}
                  removeImage={this.removeImageFromS3}
                />
              );
            }}
          />
        </ScrollView>
      </View>
    );
  }
}

let { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerStyle: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    padding: 13
  },
  buttonStyle: {
    fontSize: 40,
    color: "#4286f4"
  },
  imageStyle: {
    width: width,
    height: width,
    marginBottom: 12
  }
});
