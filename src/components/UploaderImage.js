import React, { useEffect, useState, useCallback } from 'react';
import {useDropzone} from 'react-dropzone'
import axios from 'axios';
import './css/uploaderImage.css';


const UploaderImage = () => {

    const [userProfiles, setUserProfiles] = useState([]);

    const fetchUserProfiles = () => {

        axios.get("http://localhost:8080/api/v1/user-profile").then(res => {
            console.log("res: ",res);
            setUserProfiles(res.data);
        });
    };

    useEffect(() => {
        fetchUserProfiles();
    },[]);





    function Dropzone({userProfileId}) {
        const onDrop = useCallback(acceptedFiles => {
          
            const file = acceptedFiles[0];
            console.log("FILE: ",file);

            const formData = new FormData();
            formData.append("file", file);

            axios.post(`http://localhost:8080/api/v1/user-profile/${userProfileId}/image/upload`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }).then(() => {
                console.log("image was uploaded successfully!");
            }).catch(err => {
                console.log(err);
            });

        }, []);
        
        const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
      
        return (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {
              isDragActive ?
                <p>Arrastra tu imagen acá...</p> :
                <p>Arrastra tu imagen o da clic para seleccionarla</p>
            }
          </div>
        )
      }

    return userProfiles.map((userProfile, index) => {
        console.log("userProfile: ",userProfile);
        // {userProfile.userProfileId ? <img src={`http://localhost:8080/api/v1/user-profile/${userProfile.userProfileId}/image/download`} /> : null}
        const title = userProfile.username.split(".")[0];
        console.log("TITLE: ",title);
        return (
            <div id="content" key={index}>
               {userProfile.userProfileId ? <img id="imgS3"  src={`http://localhost:8080/api/v1/user-profile/${userProfile.userProfileId}/image/download`} /> : null}
                <br />
                <br />
                <h1>{title}</h1>                
                <div id="dropZone" className="card card-body" style={{width: '500px'}}>
                    <Dropzone {...userProfile}/>
                </div>
                <br />                
            </div>
        )
    })

};







export default UploaderImage;
