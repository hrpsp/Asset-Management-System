<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssetPhotoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'photo_type' => $this->photo_type,
            'file_path' => $this->file_path,
            'url' => $this->url,
            'caption' => $this->caption,
            'uploaded_at' => $this->uploaded_at?->format('Y-m-d H:i:s'),
        ];
    }
}
