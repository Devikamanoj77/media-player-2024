import React,{useEffect, useState} from 'react'
import { Modal,Form,FloatingLabel,Button } from 'react-bootstrap'
import { getAllCategoryAPI, saveCategoryAPI,deleteCategoryAPI, updateCategoryAPI, removeVideoAPI } from '../services/allAPI';
import VideoCard from './VideoCard';


const Category = ({setdeleteResponseFromCategory,deleteResponseFromView}) => {
  const[allCategories,setAllCategories]= useState([])

  const[CategoryName,setCategoryName]= useState("")
  const [show, setShow] = useState(false);

 


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(()=>{
    getAllCategories()
  },[deleteResponseFromView])

  const handleSaveCategory = async ()=>{
    if(CategoryName){
      const categoryDetails = {CategoryName,allVideos:[]}
      try{
        const result = await saveCategoryAPI(categoryDetails)
        if(result.status>=200 && result.status<300){
          alert("Category Created")
          getAllCategories()
          handleClose()
        }
      }catch(err){
        console.log(err);  
      }
    }else{
      alert("Please enter category name!!")
    }
  }

  const getAllCategories = async()=>{
    try{
      const result =await getAllCategoryAPI()
      if(result.status>=200 && result.status<300 )
        setAllCategories(result.data)
    }catch(err){
      console.log(err);
      
    }
  }

  const removeCategory = async(id)=>{
    try{
      await deleteCategoryAPI(id)
      getAllCategories()
    }catch(err){
      console.log(err);
      
    }
  }

  const dragOverCategory=(e)=>{
    e.preventDefault()
  }
  const videoCardDropOverCategory = async(e,categoryDetails)=>{
    console.log("Inside videoCardDropOverCategory");
    const videoDetails = JSON.parse(e.dataTransfer.getData("videoDetails"))
    console.log(videoDetails);
    // update category by add video to its allVideos
    categoryDetails.allVideos.push(videoDetails)
    console.log(categoryDetails);
    // api call to make update the category
    await updateCategoryAPI(categoryDetails)
    getAllCategories()
    const result = await removeVideoAPI(videoDetails.id)
    setdeleteResponseFromCategory(result)
  }

  const categoryVideoDragStarted  = (e,dragVideoDetails,categoryDetails)=>{
    console.log("Inside categoryVideoDragStarted");
    let dragData = {video:dragVideoDetails,categoryDetails}
    e.dataTransfer.setData("dragData",JSON.stringify(dragData))
  }

  return (
    <>

      <div className="d-flex justify-content-around">
          <h3>All Categories</h3>
          <button onClick={handleShow} className='btn btn-info ms-3 rounded-circle fw-bolder fs-5'> +</button>
      </div>

      {/* display all category */}
      <div className="container-fluid mt-3">
        {/* single category view */}
        {
          allCategories?.length>0?
          allCategories?.map(categoryDetails=>(
            <div droppable="true" onDragOver={dragOverCategory} onDrop={e=>videoCardDropOverCategory(e,categoryDetails)} 
            key={categoryDetails?.id} className="border rounded p-3 mb-3">
              <div className="d-flex justify-content-between">
                <h5 >{categoryDetails?.CategoryName}</h5>
                <button onClick={()=>removeCategory(categoryDetails?.id)} className="btn"><i className="fa-solid fa-trash text-danger"></i></button>
              </div>
              {/* display category videos */}
              <div className="row mt-2">
                {
                  categoryDetails?.allVideos?.length>0 &&
                  categoryDetails?.allVideos?.map(video=>(
                    <div draggable={true} onDragStart={e=>categoryVideoDragStarted(e,video,categoryDetails)}
                     key={video?.id} className='col-lg-4'>
                      {/* video card */}
                      <VideoCard insideCategory={true} displayData={video}/>
                    </div>
                  ))
                }
              </div>
            </div>
          ))
        :
        <div className="fw-bolder text-danger fs-5">No Categories are added Yet!!!</div>
        }
      </div>

      
      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Category Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel controlId="floatingCategoryName" label="CategoryName">
            <Form.Control onChange={e=>setCategoryName(e.target.value)} type="text" placeholder="CategoryName" />
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button  variant="primary" onClick={handleSaveCategory}>
            ADD
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Category