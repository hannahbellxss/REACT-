<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:12', 'unique:products,code'],
            'name' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string'],
            'manufacturer' => ['required', 'string', 'max:100'],
            'photo' => ['required', 'image', 'mimes:jpeg,jpg,png,gif,webp', 'max:2048'],
            'price' => ['required', 'numeric', 'between:0,99999.99'],
            'cost' => ['required', 'numeric', 'between:0,99999.99'],
            'inventory_quantity' => ['required', 'integer', 'min:0'],
        ];
    }
}
