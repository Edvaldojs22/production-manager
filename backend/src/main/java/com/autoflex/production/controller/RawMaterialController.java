package com.autoflex.production.controller;

import com.autoflex.production.entity.RawMaterial;
import com.autoflex.production.repository.RawMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/raw-materials")
@CrossOrigin("*")
public class RawMaterialController {
    @Autowired
    private RawMaterialRepository repository;

    @GetMapping
    public List<RawMaterial> getAll(){
        return  repository.findAll();
    }

    @PostMapping
    public  RawMaterial create(@RequestBody RawMaterial material){
        return  repository.save(material);
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable Long id){
        repository.deleteById(id);
    }
}
