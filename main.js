const list = document.querySelector('ul');

const form = document.querySelector('form');
const noteTxt = document.querySelector('textarea');
const search = document.querySelector('.search');
const cb = document.getElementById('importantCB');
const showBtn = document.querySelector(".btnSHow");

const addNote = (note, id) =>{
    let time = note.date.toDate();
    let body = note.body;
    
    
    

    let html = `
    <div>
    <li id="hej" data-id="${id}">
        <div><h5 class="noteHeader">Title</h5> <span>${note.title}</span></div>
        <h5 class="noteHeader">Timestamp</h5><div>${time}</div> 
        <h5 class="noteHeader">Text</h5> <div>${body}</div>
        <button class="btn btn-danger btn-sm my-2">Delete note</button>
        <br>
        <span class="importantTxt"></span>
    </li>
    </div>
    <br>
    `;
    list.innerHTML += html;
    
}

    const deleteNote = (id)=>{
        const notes = document.querySelectorAll('li');
        notes.forEach(note =>{
            if(note.getAttribute('data-id') ===  id){
                note.remove();
            }
        })
    }

    db.collection('notes').onSnapshot(snapshot =>{

        snapshot.docChanges().forEach(change =>{

            const doc = change.doc;
            ''
            if(change.type === 'added'){
                addNote(doc.data(), doc.id)
            }
            
            else if(change.type === 'removed'){
                deleteNote(doc.id)

          
            }

            let noteID = document.querySelector(`li[data-id="${ doc.id }"]`);
            let impNote = noteID.querySelector(".importantTxt");
            
            if(cb.checked === true){
                impNote.innerText = 'This is an important note' ;
                

             }else{
                 impNote.innerText = 'Not important';

             }
        })
    });

    
   //add new note
   form.addEventListener('submit', e =>{
       e.preventDefault()

       const now = new Date(); 
       const note ={
        title: form.note.value,
        date: firebase.firestore.Timestamp.fromDate(now),
        body: noteTxt.value,
        important: cb.checked

       };
       
       db.collection('notes').add(note).then(() =>{
           console.log('recipe added')
       }).catch(err =>[
           console.log('err')
       ])
       
       
            
   });
   

   //Deleting data
   list.addEventListener('click', e =>{
       if(e.target.tagName === 'BUTTON'){
        const id = e.target.parentElement.getAttribute('data-id');
        db.collection('notes').doc(id).delete().then(() =>{
            console.log('note deleted')
        });
       }
   });

   const test = document.querySelector('span')
   const filterKeyword = (keyword) =>{
        Array.from(list.children)
        .filter((liNote) => !liNote.textContent.includes(keyword))
        .forEach((liNote) => liNote.classList.add('filtered'));

        Array.from(list.children)
        .filter((liNote) => liNote.textContent.includes(keyword))
        .forEach((liNote) => liNote.classList.remove('filtered'));
   };

   search.addEventListener('keyup', () =>{
       const keyword = search.value.trim();
       filterKeyword(keyword);
   });

   function isNoteImp() {

    if (document.getElementById('impFilter').checked) {

        db.collection('notes').onSnapshot(snapshot => {
            snapshot.docs.forEach(doc => {

                const id = doc.id;
                const data = doc.data();
                const importantNote = document.querySelector(`li[data-id="${id}"]`);
            
                if (data.important != true) {
                    importantNote.style.display = 'none';
                }
            })  
        });
    }

    else {
        db.collection('notes').onSnapshot(snapshot => {
            snapshot.docs.forEach(doc => {

                const id = doc.id;
                const importantNote = document.querySelector(`li[data-id="${id}"]`);
            
                importantNote.style.display = 'inline-block';
    
            })  
        });
    }
}




   
  
