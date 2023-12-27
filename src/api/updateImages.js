// import { getStorage, ref, uploadBytes } from 'firebase/storage'

// // // Create a root reference
// // const storage = getStorage()

// // // Create a reference to 'mountains.jpg'
// // const mountainsRef = ref(storage, 'characters.png')

// // // Create a reference to 'images/characters.png'
// // const mountainImagesRef = ref(storage, 'images/characters.png')

// // const storageRef = ref(storage, 'some-child')

// // // 'file' comes from the Blob or File API
// // uploadBytes(storageRef, file).then((snapshot) => {
// //   console.log('Uploaded a blob or file!')
// // })

// // const ref = firebase.storage().ref();

// const file = document.querySelector('#photo').files[0]
// const name = +new Date() + '-' + file.name
// const metadata = {
//   contentType: file.type,
// }
// const task = ref.child(name).put(file, metadata)
// task
//   .then((snapshot) => snapshot.ref.getDownloadURL())
//   .then((url) => {
//     console.log(url)
//     // document.querySelector('#someImageTagID').src = url
//   })
//   .catch(console.error)
