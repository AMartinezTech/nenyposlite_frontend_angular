import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { TaxI } from '../../models/tax';
import { TaxService } from '../../services/tax.service';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss']
})
export class TaxComponent implements OnInit {

       taxProductForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    public taxService: TaxService
  ) {}

  ngOnInit(): void {
    this.taxProductForm = this.iniForm();
    this.getAll();
  }

  iniForm(): FormGroup {
    return this.fb.group({
      id: new FormControl(0),
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30)
      ]),
      value: new FormControl(0,[
        Validators.required,
        //Validators.pattern("0-9")
      ])
    });
  }

  onSave(): void {
    if (this.taxProductForm.value.id > 0) {
      Swal.fire({
        title: 'Modificar?',
        text: 'Está modificando el documento!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Si, modificar!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.taxService
            .onUpdate(this.taxProductForm.value)
            .subscribe((res) => {
              this.getAll();
              this.taxProductForm.reset();
            });
            this.alertDone();
        }
      });
    } else {
      this.taxService
        .onSave(this.taxProductForm.value)
        .subscribe((res) => {
          this.getAll();
          this.taxProductForm.reset();
          this.alertDone();
        });
    }
  }

  getAll() {
    this.taxService.getAll().subscribe((res) => {
      console.log(res);
      this.taxService.tax = res.result;
    }).unsubscribe;
    // Unsubscribing from the observable for optimization of memory usage
  }
  
  onDelete(id: number): void {
    Swal.fire({
      title: 'Borrando el documento',
      text: 'No podrá recuperarlo si lo hace!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, borralo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.taxService.onDelete(id).subscribe((res) => {
          this.getAll();
          this.taxProductForm.reset();
        });
        this.alertDone();
      }
    });
  }

  onEdit(tax: TaxI) {
    // capture data for later editing
    this.taxProductForm.patchValue({ id: tax.id });
    this.taxProductForm.patchValue({ name: tax.name });
    this.taxProductForm.patchValue({ value: tax.value });
    
  }

  alertDone() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Operación exitosa',
      showConfirmButton: false,
      timer: 1200,
    });
  }
 

}
