import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FileUpload.css';

export default function FileUpload(){
    const [files, setFiles] = useState([]);
    const [draggingIndex, setDraggingIndex] = useState(null);
    const [payLoad , setPayload] = useState([])

    useEffect(() => {
        // Fetch initial data from the backend
        axios.get('http://localhost:5000/api/files')
          .then(response => {
            setFiles(response.data);
          })
          .catch(error => {
            console.error('Error fetching files:', error);
          });
    }, []);

    useEffect(() => {
        if(payLoad.length > 0) {uploadData()}
    } , [payLoad])

    const uploadData = async() => {
      try {
        const response = await axios.post('http://localhost:5000/api/upload', payLoad, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Upload successful:', response.data);
        } catch (error) {
          console.error('Error uploading files:', error);
        }
    
    }

    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files);
        const newFilePreviews = newFiles.map((file) => ({
          id: `file-${Date.now()}-${file.name}`,
          file: file,
          url: URL.createObjectURL(file),
          name: file.name,
          type: file.type,
        }));
        setFiles([...files, ...newFilePreviews]);
    };

const handleUpload =  () => {
      // const formData = new FormData();

    files.map((fileObj, index) => {
      setPayload(prevPayload => [...prevPayload, fileObj?.file]);
        // formData.append(`file${index}`, fileObj.file);
    });
    // console.log("payLoad" , payLoad)
  }

    

    const handleDragStart = (index) => {
        setDraggingIndex(index);
    };

    const handleDragOver = (index) => {
        if (draggingIndex === index) return;
        const updatedFiles = [...files];
        const draggedItem = updatedFiles.splice(draggingIndex, 1)[0];
        updatedFiles.splice(index, 0, draggedItem);
        setDraggingIndex(index);
        setFiles(updatedFiles);
    };

    const handleDragEnd = () => {
        // Update the order in the backend
        // axios.post('/api/update-order', { files: files.map(file => file.id) })
        //   .then(response => {
        //     console.log('Order updated:', response.data);
        //   })
        //   .catch(error => {
        //     console.error('Error updating order:', error);
        //   });
        // setDraggingIndex(null);
        console.log("order to be updated");
    };

    const renderFilePreview = (file, index) => {
        if (file.type.startsWith('image/')) {
          return <img src={file.url} alt={file.name} />;
        } else if (file.type === 'application/pdf') {
          return <embed src={file.url} type="application/pdf" width="100" height="100" />;
        } else if (file.type.startsWith('video/')) {
          return <video src={file.url} width="100" height="100" controls />;
        } else {
          return <p>{file.name}</p>;
        }
    };

    return (
        <div>
            <input type="file" multiple onChange={handleFileChange} />
            <div className='preview'>
                {
                    files.map((file, index)=>{
                        return (
                            <div
                            key={file.id}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={() => handleDragOver(index)}
                            onDragEnd={handleDragEnd}
                            className="file-item"
                            >
                                {renderFilePreview(file, index)};
                            </div>
                        )
                    })
                }
            </div>
            <button onClick={handleUpload}>Upload</button>
        </div>
    )
}