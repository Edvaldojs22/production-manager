package com.autoflex.production.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NonNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;


@Table(name = "raw_materials")
@Data
@Entity
public class RawMaterial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;
    private String name;

    private  String unit;

    private  Double stockQuantity;

    @CreationTimestamp
    @Column(updatable = false)
    private  LocalDateTime createDAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

}
