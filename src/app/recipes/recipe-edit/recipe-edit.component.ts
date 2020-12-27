import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Ingredients } from 'src/app/shared/ingredient.model';

import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
id:number;
editMode=false;
recipeForm:FormGroup;
  constructor(private route:ActivatedRoute,private recipeService:RecipeService,private router:Router) { }

  ngOnInit(){
    this.route.params
    .subscribe((params:Params)=>{
      this.id=+params['id'];
      this.editMode=params['id']!=null;
      this.initForm();
    }
    );
  }
  onSubmit(){
   // const newRecipe = new Recipe(
    //this.recipeForm.value['name'],
    //this.recipeForm.value['desciption'],
    //this.recipeForm.value['imagePath'],
    //this.recipeForm.value['ingredients']);
  if(this.editMode){
    this.recipeService.updateRecipe(this.id,this.recipeForm.value);
  }
  else{
    this.recipeService.addRecipe(this.recipeForm.value);
  }
    this.onCancel();
  }
  onaddIngredients(){
  (<FormArray> this.recipeForm.get('ingredients')).push(
    new FormGroup({
      'name': new FormControl(null,Validators.required),
      'amount':new FormControl(null,[
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/)
      ])
    })
  )
  }
  ondeleteIngredients(index:number){
(<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
  onCancel(){
    this.router.navigate(['../'],{relativeTo:this.route})
  }
private initForm(){
  let recipeImagepath='';
  let recipedescription='';
  let recipename='';
  let recipeIngredient=new FormArray([]);
  if(this.editMode){
    const recipe=this.recipeService.getRecipe(this.id);
    recipename=recipe.name;
    recipeImagepath=recipe.imagePath;
    recipedescription=recipe.description;
    if(recipe['ingredients']){
      for(let ingredient of recipe.ingredients){
        recipeIngredient.push(
        new FormGroup({
          'name':new FormControl(ingredient.name,Validators.required),
          'amount':new FormControl(ingredient.amount,[
            Validators.required,
            Validators.pattern(/^[1-9]+[0-9]*$/)
          ])

        })
        );
      }
    }
  }
this.recipeForm=new FormGroup({
  'name':new FormControl(recipename,Validators.required),
  'imagePath': new FormControl(recipeImagepath,Validators.required),
  'description': new FormControl(recipedescription,Validators.required),
  'ingredients':recipeIngredient
});
}
}
