import React from "react";
import Dropzone from "react-dropzone";

// for profile picture
class ImageUpload extends React.Component {
  state = { warningMsg: "" };

  onDrop = (accepted, rejected) => {
    if (Object.keys(rejected).length !== 0) {
      const message = "Please submit valid file type";
      this.setState({ warningMsg: message });
    } else {
      this.props.addFile(accepted);
      this.setState({ warningMsg: "" });
      console.log(accepted[0].preview);

      var blobPromise = new Promise((resolve, reject) => {
        const reader = new window.FileReader();
        reader.readAsDataURL(accepted[0]);
        reader.onloadend = () => {
          const base64data = reader.result;
          resolve(base64data);
        };
      });
      blobPromise.then((value) => {
        // console.log(value);
      });
    }
  };

  render() {
    const { files } = this.props;
    const thumbsContainer = {
      width: "150px",
      height: "150px",
      borderRadius: "50%",
      objectFit: "cover",
      objectPosition: "center"
    };


    const render =
      Object.keys(files).length !== 0 ? (
        files.map((file) => <aside className="minted_image"><img style={thumbsContainer} src={file.preview} alt="profile" /></aside>)
      ) : (
        <p className="minted_message">Please click or drag file...</p>
      );

    return (
      <div>
        <p>{this.state.warningMsg}</p>

        <Dropzone
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            objectFit: "cover",
            objectPosition: "center",
            border: " 1px dashed"
          }}
          multiple={false}
          accept="image/*"
          onDrop={(accepted, rejected) => this.onDrop(accepted, rejected)}
        >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            { render}
          </div>
        )}
        </Dropzone>
      </div>
    );
  }
}

export default ImageUpload;
